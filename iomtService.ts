import { IoMTDevice, IoMTReading } from '../types';
import { storageService } from './storageService';
import { blockchainService } from './blockchainService';

export const iomtService = {
  // Get all devices
  getDevices(): IoMTDevice[] {
    return storageService.getIoMTDevices();
  },

  // Simulate slight natural variation in readings (live telemetry)
  tickReadings(): void {
    const devices = storageService.getIoMTDevices();
    const timestamp = new Date().toISOString();

    devices.forEach((dev) => {
      // Don't overwrite if manually set to abnormal
      if (dev.currentReading.isAbnormal) return;

      const reading: IoMTReading = {
        timestamp,
        isAbnormal: false,
      };

      if (dev.type === 'Blood Pressure Monitor') {
        const sys = 126 + Math.floor(Math.random() * 5);
        const dia = 80 + Math.floor(Math.random() * 4);
        const hr = 71 + Math.floor(Math.random() * 4);
        reading.systolic = sys;
        reading.diastolic = dia;
        reading.bloodPressure = `${sys}/${dia} mmHg`;
        reading.heartRate = hr;
      } else if (dev.type === 'Continuous Glucose Monitor') {
        const gluc = 106 + Math.floor(Math.random() * 6);
        reading.glucose = gluc;
      } else if (dev.type === 'Pulse Oximeter') {
        reading.spO2 = 98 + Math.floor(Math.random() * 2);
        reading.heartRate = 72 + Math.floor(Math.random() * 3);
      } else if (dev.type === 'Smart ECG') {
        reading.heartRate = 72 + Math.floor(Math.random() * 3);
        reading.ecgStatus = 'Normal Sinus Rhythm';
      }

      storageService.updateIoMTDevice(dev.id, {
        currentReading: { ...dev.currentReading, ...reading },
        lastUpdate: 'Just now',
      });
    });
  },

  // Trigger simulated abnormal reading for demo
  injectAnomaly(
    deviceId: string,
    anomalyType: 'TACHYCARDIA' | 'HYPERTENSIVE_CRISIS' | 'HYPERGLYCEMIA' | 'HYPOXIA'
  ): { success: boolean; txHash: string; description: string } {
    const devices = storageService.getIoMTDevices();
    const device = devices.find((d) => d.id === deviceId);

    if (!device) {
      return { success: false, txHash: '', description: 'Device not found' };
    }

    const timestamp = new Date().toISOString();
    let anomalyDesc = '';
    let readingUpdates: Partial<IoMTReading> = {
      timestamp,
      isAbnormal: true,
    };

    if (anomalyType === 'TACHYCARDIA') {
      readingUpdates.heartRate = 152;
      readingUpdates.ecgStatus = 'Sinus Tachycardia';
      anomalyDesc = 'CRITICAL: Tachycardia detected. Sustained Heart Rate 152 BPM (Threshold > 120 BPM).';
      readingUpdates.anomalyDescription = anomalyDesc;
    } else if (anomalyType === 'HYPERTENSIVE_CRISIS') {
      readingUpdates.systolic = 178;
      readingUpdates.diastolic = 108;
      readingUpdates.bloodPressure = '178/108 mmHg';
      readingUpdates.heartRate = 96;
      anomalyDesc = 'WARNING: Stage 2 Hypertensive spike detected. BP: 178/108 mmHg.';
      readingUpdates.anomalyDescription = anomalyDesc;
    } else if (anomalyType === 'HYPERGLYCEMIA') {
      readingUpdates.glucose = 245;
      anomalyDesc = 'WARNING: Acute Hyperglycemia event. Blood Glucose 245 mg/dL (Threshold > 180 mg/dL).';
      readingUpdates.anomalyDescription = anomalyDesc;
    } else if (anomalyType === 'HYPOXIA') {
      readingUpdates.spO2 = 87;
      readingUpdates.heartRate = 110;
      anomalyDesc = 'CRITICAL: Hypoxia event. SpO2 desaturation to 87% (Threshold < 92%).';
      readingUpdates.anomalyDescription = anomalyDesc;
    }

    // Update device
    storageService.updateIoMTDevice(device.id, {
      status: 'WARNING',
      currentReading: { ...device.currentReading, ...readingUpdates },
      lastUpdate: 'Alert Triggered',
    });

    // Record on blockchain: IOMT_ALERT
    const tx = blockchainService.recordTransaction({
      type: 'IOMT_ALERT',
      actorDid: device.did,
      actorName: device.name,
      patientDid: device.patientDid,
      institution: device.institution,
      status: 'FLAGGED',
      details: `${device.name} [${device.did}] reported clinical anomaly: ${anomalyDesc}`,
      metadata: {
        deviceId: device.id,
        anomalyType,
        telemetry: JSON.stringify(readingUpdates),
      },
    });

    // Record security event
    storageService.addSecurityEvent({
      id: 'sec-iomt-' + Date.now(),
      timestamp,
      type: 'IOMT_ANOMALY',
      severity: 'CRITICAL',
      actorDid: device.did,
      targetDid: device.patientDid,
      institution: device.institution,
      description: `IoMT Device Anomaly on ${device.name}: ${anomalyDesc}`,
      actionTaken: 'IoMT alert dispatched to attending cardiologist & locked into immutable blockchain block.',
    });

    storageService.addNotification({
      title: 'IoMT Anomaly Detected',
      message: `${device.name}: ${anomalyDesc}`,
      type: 'error',
    });

    return {
      success: true,
      txHash: tx.txHash,
      description: anomalyDesc,
    };
  },

  // Reset device reading back to normal baseline
  restoreNormal(deviceId: string): void {
    const devices = storageService.getIoMTDevices();
    const device = devices.find((d) => d.id === deviceId);
    if (!device) return;

    let normalReading: IoMTReading = {
      timestamp: new Date().toISOString(),
      isAbnormal: false,
    };

    if (device.type === 'Blood Pressure Monitor') {
      normalReading.bloodPressure = '128/82 mmHg';
      normalReading.systolic = 128;
      normalReading.diastolic = 82;
      normalReading.heartRate = 72;
    } else if (device.type === 'Continuous Glucose Monitor') {
      normalReading.glucose = 108;
    } else if (device.type === 'Pulse Oximeter') {
      normalReading.spO2 = 98;
      normalReading.heartRate = 72;
    } else if (device.type === 'Smart ECG') {
      normalReading.heartRate = 72;
      normalReading.ecgStatus = 'Normal Sinus Rhythm';
    }

    storageService.updateIoMTDevice(device.id, {
      status: 'ONLINE',
      currentReading: normalReading,
      lastUpdate: 'Normal baseline restored',
    });

    storageService.addNotification({
      title: 'IoMT Baseline Restored',
      message: `${device.name} returned to normal telemetry threshold.`,
      type: 'success',
    });
  },
};
