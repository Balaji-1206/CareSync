import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { vitalsService } from '../services/api';

const PatientDetailScreen = ({ route, navigation }) => {
  const { patientId, patientName } = route.params;
  const [vitals, setVitals] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      title: patientName,
    });
    loadVitals();
  }, [patientId]);

  const loadVitals = async () => {
    try {
      setIsLoading(true);
      // In real app, use: const data = await vitalsService.getLatestVitals(patientId);
      // For now, use mock data
      const mockVitals = {
        HR: { value: 72, time: new Date() },
        SpO2: { value: 98, time: new Date() },
        Temp: { value: 36.8, time: new Date() },
        RR: { value: 16, time: new Date() },
        Fall: { value: 0, time: new Date() },
        status: 'normal',
      };
      setVitals(mockVitals);
    } catch (error) {
      console.error('Failed to load vitals:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadVitals();
    setRefreshing(false);
  };

  const getStatusColor = (vital, value) => {
    // Normal ranges
    const ranges = {
      HR: { low: 60, high: 100, critical_low: 50, critical_high: 120 },
      SpO2: { low: 95, high: 100, critical_low: 90 },
      Temp: { low: 36, high: 37.5, critical_low: 35, critical_high: 38.5 },
      RR: { low: 12, high: 20, critical_low: 8, critical_high: 30 },
    };

    const range = ranges[vital];
    if (!range) return '#999';

    if (value < range.critical_low || value > range.critical_high) {
      return '#ff4444'; // Critical
    }
    if (value < range.low || value > range.high) {
      return '#ffaa00'; // Warning
    }
    return '#00cc44'; // Normal
  };

  const VitalCard = ({ title, value, unit, status }) => (
    <View style={styles.vitalCard}>
      <View style={styles.vitalCardHeader}>
        <Text style={styles.vitalCardTitle}>{title}</Text>
        <View
          style={[
            styles.statusDot,
            { backgroundColor: getStatusColor(title, value) },
          ]}
        />
      </View>
      <Text style={styles.vitalCardValue}>
        {value.toFixed(title === 'Temp' ? 1 : 0)}
      </Text>
      <Text style={styles.vitalCardUnit}>{unit}</Text>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0080ff" />
      </View>
    );
  }

  if (!vitals) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load vitals data</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadVitals}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Alert Banner if Critical */}
      {vitals.status === 'critical' && (
        <View style={styles.alertBanner}>
          <Text style={styles.alertText}>⚠️ CRITICAL - Immediate attention needed</Text>
        </View>
      )}

      {/* Main Vitals */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Current Vitals</Text>
        <View style={styles.vitalGrid}>
          <VitalCard
            title="HR"
            value={vitals.HR.value}
            unit="bpm"
            status={vitals.status}
          />
          <VitalCard
            title="SpO2"
            value={vitals.SpO2.value}
            unit="%"
            status={vitals.status}
          />
          <VitalCard
            title="Temp"
            value={vitals.Temp.value}
            unit="°C"
            status={vitals.status}
          />
          <VitalCard
            title="RR"
            value={vitals.RR.value}
            unit="br/min"
            status={vitals.status}
          />
        </View>
      </View>

      {/* Fall Detection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Fall Detection</Text>
        <View
          style={[
            styles.fallCard,
            vitals.Fall.value === 1
              ? styles.fallCardDetected
              : styles.fallCardSafe,
          ]}
        >
          <Text style={styles.fallText}>
            {vitals.Fall.value === 1 ? '⚠️ Fall Detected' : '✅ No Fall'}
          </Text>
        </View>
      </View>

      {/* Last Updated */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Information</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Last Updated:</Text>
            <Text style={styles.infoValue}>
              {vitals.HR.time
                ? new Date(vitals.HR.time).toLocaleTimeString()
                : 'N/A'}
            </Text>
          </View>
          <View style={[styles.infoRow, styles.borderTop]}>
            <Text style={styles.infoLabel}>Status:</Text>
            <Text
              style={[
                styles.infoValue,
                {
                  color:
                    vitals.status === 'critical'
                      ? '#ff4444'
                      : vitals.status === 'warning'
                      ? '#ffaa00'
                      : '#00cc44',
                },
              ]}
            >
              {vitals.status.toUpperCase()}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.spacing} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#0080ff',
    borderRadius: 8,
    paddingHorizontal: 32,
    paddingVertical: 12,
  },
  retryText: {
    color: '#fff',
    fontWeight: '600',
  },
  alertBanner: {
    backgroundColor: '#ff4444',
    padding: 16,
    margin: 12,
    borderRadius: 8,
  },
  alertText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  section: {
    marginBottom: 16,
    paddingHorizontal: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  vitalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  vitalCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderTopWidth: 4,
    borderTopColor: '#0080ff',
  },
  vitalCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  vitalCardTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#999',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  vitalCardValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
  },
  vitalCardUnit: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  fallCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderTopWidth: 4,
  },
  fallCardSafe: {
    borderTopColor: '#00cc44',
  },
  fallCardDetected: {
    borderTopColor: '#ff4444',
  },
  fallText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  borderTop: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  spacing: {
    height: 32,
  },
});

export default PatientDetailScreen;
