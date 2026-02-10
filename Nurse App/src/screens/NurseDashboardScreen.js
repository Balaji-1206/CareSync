import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useAuth } from '../context/AuthContext';

// Mock data for nurse's assigned patients
const ASSIGNED_PATIENTS = [
  {
    id: 'P001',
    name: 'John Smith',
    bedNumber: 'ICU-101',
    status: 'normal',
    lastUpdated: new Date(),
  },
  {
    id: 'P002',
    name: 'Sarah Johnson',
    bedNumber: 'ICU-102',
    status: 'warning',
    vitals: {
      heartRate: 95,
      temperature: 37.8,
      respirationRate: 22,
      spo2: 93,
    },
    lastUpdated: new Date(),
  },
  {
    id: 'P004',
    name: 'Emily Davis',
    bedNumber: 'ICU-104',
    status: 'normal',
    vitals: {
      heartRate: 68,
      temperature: 36.5,
      respirationRate: 16,
      spo2: 97,
    },
    lastUpdated: new Date(),
  },
];

const NurseDashboardScreen = ({ navigation }) => {
  const [patients, setPatients] = useState(ASSIGNED_PATIENTS);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { user, signOut } = useAuth();

  const onRefresh = async () => {
    setRefreshing(true);
    // In real app, fetch from backend
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'critical':
        return '#ff4444';
      case 'warning':
        return '#ffaa00';
      case 'normal':
        return '#00cc44';
      default:
        return '#999';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'critical':
        return '🚨 Critical';
      case 'warning':
        return '⚠️ Warning';
      case 'normal':
        return '✅ Normal';
      default:
        return 'Unknown';
    }
  };

  const renderPatientCard = ({ item }) => {
    const vitals = item.vitals;
    return (
    <TouchableOpacity
      style={styles.patientCard}
      onPress={() =>
        navigation.navigate('PatientDetail', {
          patientId: item.id,
          patientName: item.name,
        })
      }
    >
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.patientName}>{item.name}</Text>
          <Text style={styles.bedNumber}>Bed: {item.bedNumber}</Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.status) },
          ]}
        >
          <Text style={styles.statusText}>{getStatusLabel(item.status)}</Text>
        </View>
      </View>

      <View style={styles.vitalsRow}>
        <View style={styles.vitalItem}>
          <Text style={styles.vitalLabel}>HR</Text>
          <Text style={styles.vitalValue}>{vitals ? vitals.heartRate : '—'}</Text>
          <Text style={styles.vitalUnit}>bpm</Text>
        </View>
        <View style={styles.vitalItem}>
          <Text style={styles.vitalLabel}>SpO₂</Text>
          <Text style={styles.vitalValue}>{vitals ? vitals.spo2 : '—'}</Text>
          <Text style={styles.vitalUnit}>{vitals ? '%' : ''}</Text>
        </View>
        <View style={styles.vitalItem}>
          <Text style={styles.vitalLabel}>Temp</Text>
          <Text style={styles.vitalValue}>{vitals ? vitals.temperature : '—'}</Text>
          <Text style={styles.vitalUnit}>{vitals ? '°C' : ''}</Text>
        </View>
        <View style={styles.vitalItem}>
          <Text style={styles.vitalLabel}>RR</Text>
          <Text style={styles.vitalValue}>{vitals ? vitals.respirationRate : '—'}</Text>
          <Text style={styles.vitalUnit}>{vitals ? 'br/min' : ''}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {user?.name || 'Nurse'}</Text>
          <Text style={styles.subtitle}>Your Assigned Patients</Text>
        </View>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={signOut}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Patients List */}
      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#0080ff" />
        </View>
      ) : (
        <FlatList
          data={patients}
          renderItem={renderPatientCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}

      {/* Empty State */}
      {!isLoading && patients.length === 0 && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No assigned patients</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: 48,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  greeting: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  subtitle: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  logoutButton: {
    backgroundColor: '#fff3cd',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  logoutText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#d4a017',
  },
  listContent: {
    padding: 12,
  },
  patientCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#0080ff',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  patientName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  bedNumber: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  statusBadge: {
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#fff',
  },
  vitalsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  vitalItem: {
    flex: 1,
    alignItems: 'center',
  },
  vitalLabel: {
    fontSize: 11,
    color: '#999',
    marginBottom: 2,
  },
  vitalValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  vitalUnit: {
    fontSize: 10,
    color: '#999',
    marginTop: 2,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});

export default NurseDashboardScreen;
