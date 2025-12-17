/**
 * StatCard - Displays a single user statistic
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface StatCardProps {
  icon: string;
  label: string;
  value: string | number;
  iconColor?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export default function StatCard({
  icon,
  label,
  value,
  iconColor = '#2196F3',
  trend,
}: StatCardProps) {
  return (
    <View style={styles.container}>
      <View style={[styles.iconContainer, { backgroundColor: iconColor + '20' }]}>
        <Icon name={icon} size={32} color={iconColor} />
      </View>

      <View style={styles.content}>
        <Text style={styles.value}>{value}</Text>
        <Text style={styles.label}>{label}</Text>

        {trend && (
          <View style={styles.trendContainer}>
            <Icon
              name={trend.isPositive ? 'trending-up' : 'trending-down'}
              size={16}
              color={trend.isPositive ? '#4CAF50' : '#f44336'}
            />
            <Text
              style={[
                styles.trendText,
                { color: trend.isPositive ? '#4CAF50' : '#f44336' },
              ]}
            >
              {trend.value > 0 ? '+' : ''}
              {trend.value}%
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    color: '#666',
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  trendText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
});
