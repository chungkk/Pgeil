/**
 * ProgressChart - Visualizes user progress over time
 * Simple bar chart implementation
 */

import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

interface DataPoint {
  label: string;
  value: number;
}

interface ProgressChartProps {
  data: DataPoint[];
  title?: string;
  maxValue?: number;
  color?: string;
}

export default function ProgressChart({
  data,
  title,
  maxValue,
  color = '#2196F3',
}: ProgressChartProps) {
  const screenWidth = Dimensions.get('window').width - 64;
  const barWidth = Math.min(screenWidth / data.length - 8, 60);
  const chartHeight = 200;

  const max = maxValue || Math.max(...data.map((d) => d.value), 1);

  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}

      <View style={styles.chartContainer}>
        {/* Y-axis labels */}
        <View style={styles.yAxis}>
          <Text style={styles.axisLabel}>{max}</Text>
          <Text style={styles.axisLabel}>{Math.round(max / 2)}</Text>
          <Text style={styles.axisLabel}>0</Text>
        </View>

        {/* Bars */}
        <View style={styles.barsContainer}>
          <View style={[styles.bars, { height: chartHeight }]}>
            {data.map((item, index) => {
              const height = (item.value / max) * chartHeight;

              return (
                <View key={index} style={styles.barWrapper}>
                  <View style={styles.barContainer}>
                    <View
                      style={[
                        styles.bar,
                        {
                          height: height || 2,
                          width: barWidth,
                          backgroundColor: color,
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.barLabel} numberOfLines={1}>
                    {item.label}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  chartContainer: {
    flexDirection: 'row',
  },
  yAxis: {
    width: 40,
    justifyContent: 'space-between',
    paddingRight: 8,
  },
  axisLabel: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
  },
  barsContainer: {
    flex: 1,
  },
  bars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
  },
  barWrapper: {
    alignItems: 'center',
    marginHorizontal: 4,
  },
  barContainer: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    minHeight: 2,
  },
  bar: {
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    minHeight: 2,
  },
  barLabel: {
    fontSize: 10,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
});
