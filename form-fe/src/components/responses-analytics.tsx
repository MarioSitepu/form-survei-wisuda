import { FormResponse, FormConfig } from '@/lib/storage';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import jsPDF from 'jspdf';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface ResponsesAnalyticsProps {
  responses: FormResponse[];
  config: FormConfig | null;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border-2 border-cyan-200 rounded-lg shadow-lg p-3">
        <p className="font-semibold text-gray-900 mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name || 'Value'}: <span className="font-semibold">{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const COLORS = ['#00CCE7', '#01C0DC', '#00CCE8', '#00B8D4', '#00A8C5', '#10b981', '#f59e0b'];

export default function ResponsesAnalytics({ responses, config }: ResponsesAnalyticsProps) {
  const [isExporting, setIsExporting] = useState(false);
  
  // Filter responses by formId if config is provided
  const filteredResponses = config 
    ? responses.filter(r => r.formId === config.id)
    : responses;

  // Responses over time (always shown)
  const timeSeriesData = filteredResponses.reduce((acc: any, r) => {
    const date = new Date(r.submittedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    const existing = acc.find((item: any) => item.date === date);
    if (existing) {
      existing.count += 1;
    } else {
      acc.push({ date, count: 1 });
    }
    return acc;
  }, []).sort((a: any, b: any) => {
    // Sort by date properly
    const dateA = new Date(a.date.split(' ').reverse().join(' '));
    const dateB = new Date(b.date.split(' ').reverse().join(' '));
    return dateA.getTime() - dateB.getTime();
  });

  // Generate analytics for each field based on type
  const generateFieldAnalytics = () => {
    if (!config || !config.fields || filteredResponses.length === 0) {
      return [];
    }

    const analytics: any[] = [];

    config.fields.forEach((field) => {
      const fieldData = filteredResponses.map(r => r.data[field.name]).filter(v => v !== null && v !== undefined && v !== '');

      if (fieldData.length === 0) {
        return; // Skip fields with no data
      }

      // Select or Radio - Distribution chart
      if (field.type === 'select' || field.type === 'radio') {
        const distribution = fieldData.reduce((acc: any, value: any) => {
          const key = Array.isArray(value) ? value.join(', ') : String(value);
          acc[key] = (acc[key] || 0) + 1;
          return acc;
        }, {});

        const chartData = Object.entries(distribution).map(([name, count]) => ({
          name: name.length > 30 ? name.substring(0, 30) + '...' : name,
          count,
          fullName: name,
        }));

        if (chartData.length > 0) {
          analytics.push({
            field,
            type: 'distribution',
            data: chartData,
          });
        }
      }

      // Checkbox - Pie chart (Yes/No or multiple options)
      if (field.type === 'checkbox') {
        if (field.options && field.options.length > 0) {
          // Multiple checkbox options
          const distribution = fieldData.reduce((acc: any, value: any) => {
            const values = Array.isArray(value) ? value : [value];
            values.forEach((v: any) => {
              if (v === true || v === 'true') {
                acc['Selected'] = (acc['Selected'] || 0) + 1;
              } else if (v === false || v === 'false') {
                acc['Not Selected'] = (acc['Not Selected'] || 0) + 1;
              } else {
                acc[String(v)] = (acc[String(v)] || 0) + 1;
              }
            });
            return acc;
          }, {});

          const chartData = Object.entries(distribution).map(([name, value]) => ({
            name,
            value,
          }));

          if (chartData.length > 0) {
            analytics.push({
              field,
              type: 'pie',
              data: chartData,
            });
          }
        } else {
          // Single checkbox (boolean)
          const trueCount = fieldData.filter(v => v === true || v === 'true').length;
          const falseCount = fieldData.length - trueCount;

          if (trueCount > 0 || falseCount > 0) {
            analytics.push({
              field,
              type: 'pie',
              data: [
                { name: 'Ya', value: trueCount },
                { name: 'Tidak', value: falseCount },
              ],
            });
          }
        }
      }

      // Number - Statistics
      if (field.type === 'number') {
        const numbers = fieldData
          .map(v => {
            const num = typeof v === 'string' ? parseFloat(v) : Number(v);
            return isNaN(num) ? null : num;
          })
          .filter(n => n !== null) as number[];

        if (numbers.length > 0) {
          const sum = numbers.reduce((a, b) => a + b, 0);
          const avg = sum / numbers.length;
          const min = Math.min(...numbers);
          const max = Math.max(...numbers);

          analytics.push({
            field,
            type: 'statistics',
            data: {
              average: avg,
              min,
              max,
              count: numbers.length,
              total: sum,
            },
          });
        }
      }
    });

    return analytics;
  };

  const fieldAnalytics = generateFieldAnalytics();

  // Export to PDF function with manually drawn charts
  const exportToPDF = async () => {
    setIsExporting(true);
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageHeight = pdf.internal.pageSize.getHeight();
      const pageWidth = pdf.internal.pageSize.getWidth();
      let yPosition = 20;
      const margin = 20;
      const contentWidth = pageWidth - (margin * 2);
      const chartHeight = 60;
      const chartWidth = contentWidth;
      const chartX = margin;

      // Helper function to add new page if needed
      const checkNewPage = (requiredHeight: number) => {
        if (yPosition + requiredHeight > pageHeight - margin) {
          pdf.addPage();
          yPosition = 20;
          return true;
        }
        return false;
      };

      // Helper function to draw Bar Chart
      const drawBarChart = (title: string, data: any[], dataKey: string, valueKey: string, colors: string[] = COLORS) => {
        checkNewPage(chartHeight + 30);
        
        // Title
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(51, 51, 51);
        pdf.text(title, chartX, yPosition);
        yPosition += 8;

        const chartTop = yPosition;
        const chartBottom = chartTop + chartHeight;
        const chartLeft = chartX;
        const barAreaHeight = chartHeight - 20;
        const barAreaBottom = chartBottom - 15;
        const barAreaWidth = chartWidth - 30;

        // Draw chart border
        pdf.setDrawColor(200, 200, 200);
        pdf.rect(chartLeft, chartTop, chartWidth, chartHeight);

        if (data.length === 0) {
          pdf.setFontSize(10);
          pdf.setTextColor(150, 150, 150);
          pdf.text('No data available', chartX + 10, chartTop + chartHeight / 2);
          yPosition = chartBottom + 10;
          return;
        }

        // Find max value for scaling
        const maxValue = Math.max(...data.map(d => Number(d[valueKey]) || 0), 1);
        const barWidth = data.length > 0 ? barAreaWidth / (data.length * 2) : 0;
        const spacing = data.length > 0 ? barAreaWidth / data.length : 0;

        // Draw bars
        data.forEach((item, index) => {
          const value = Number(item[valueKey]) || 0;
          const barHeight = (value / maxValue) * barAreaHeight;
          const x = chartLeft + 15 + (index * spacing) + (spacing - barWidth) / 2;
          const y = barAreaBottom - barHeight;

          // Draw bar
          const color = colors[index % colors.length];
          const rgb = hexToRgb(color);
          if (rgb) {
            pdf.setFillColor(rgb.r, rgb.g, rgb.b);
          }
          pdf.rect(x, y, barWidth, barHeight, 'F');
          
          // Draw value on top of bar
          pdf.setFontSize(8);
          pdf.setTextColor(51, 51, 51);
          pdf.text(String(value), x + barWidth / 2, y - 2, { align: 'center' });

          // Draw label below
          const label = String(item[dataKey] || '').substring(0, 15);
          pdf.setFontSize(7);
          pdf.setTextColor(100, 100, 100);
          pdf.text(label, x + barWidth / 2, barAreaBottom + 3, { align: 'center' });
        });

        // Draw Y-axis labels
        pdf.setFontSize(8);
        pdf.setTextColor(100, 100, 100);
        for (let i = 0; i <= 4; i++) {
          const value = (maxValue / 4) * i;
          const y = barAreaBottom - (i * barAreaHeight / 4);
          pdf.text(value.toFixed(0), chartLeft + 5, y + 2, { align: 'right' });
        }

        yPosition = chartBottom + 10;
      };

      // Helper function to draw Pie Chart (as horizontal bar chart for better PDF compatibility)
      const drawPieChart = (title: string, data: any[], colors: string[] = COLORS) => {
        checkNewPage(chartHeight + 30);
        
        // Title
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(51, 51, 51);
        pdf.text(title, chartX, yPosition);
        yPosition += 8;

        const chartTop = yPosition;
        const chartBottom = chartTop + chartHeight;
        const chartLeft = chartX;
        const barAreaHeight = chartHeight - 20;
        const barAreaTop = chartTop + 5;
        const barAreaWidth = chartWidth - 30;

        // Draw chart border
        pdf.setDrawColor(200, 200, 200);
        pdf.rect(chartLeft, chartTop, chartWidth, chartHeight);

        if (data.length === 0) {
          pdf.setFontSize(10);
          pdf.setTextColor(150, 150, 150);
          pdf.text('No data available', chartX + 10, chartTop + chartHeight / 2);
          yPosition = chartBottom + 10;
          return;
        }

        // Calculate total
        const total = data.reduce((sum, item) => sum + (Number(item.value) || 0), 0);
        if (total === 0) {
          pdf.setFontSize(10);
          pdf.setTextColor(150, 150, 150);
          pdf.text('No data available', chartX + 10, chartTop + chartHeight / 2);
          yPosition = chartBottom + 10;
          return;
        }

        // Draw as horizontal stacked bars (pie chart representation)
        const barHeight = (barAreaHeight - (data.length - 1) * 4) / data.length;
        let currentX = chartLeft + 15;
        
        data.forEach((item, index) => {
          const value = Number(item.value) || 0;
          const percentage = (value / total) * 100;
          const barWidth = (percentage / 100) * barAreaWidth;
          const y = barAreaTop + (index * (barHeight + 4));

          // Draw bar
          const color = colors[index % colors.length];
          const rgb = hexToRgb(color);
          if (rgb) {
            pdf.setFillColor(rgb.r, rgb.g, rgb.b);
          }
          pdf.rect(currentX, y, barWidth, barHeight, 'F');
          
          // Draw border
          pdf.setDrawColor(200, 200, 200);
          pdf.rect(currentX, y, barAreaWidth, barHeight);

          // Draw label and value
          pdf.setFontSize(9);
          pdf.setTextColor(51, 51, 51);
          const label = `${item.name}: ${value} (${percentage.toFixed(1)}%)`;
          
          // Text color based on bar width (white if bar is wide enough, black if narrow)
          if (barWidth > 30) {
            pdf.setTextColor(255, 255, 255);
            pdf.text(label, currentX + 3, y + barHeight / 2 + 2);
          } else {
            pdf.setTextColor(51, 51, 51);
            pdf.text(label, currentX + barWidth + 5, y + barHeight / 2 + 2);
          }
        });

        yPosition = chartBottom + 10;
      };

      // Helper function to draw Line Chart
      const drawLineChart = (title: string, data: any[], dataKey: string, valueKey: string) => {
        checkNewPage(chartHeight + 30);
        
        // Title
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(51, 51, 51);
        pdf.text(title, chartX, yPosition);
        yPosition += 8;

        const chartTop = yPosition;
        const chartBottom = chartTop + chartHeight;
        const chartLeft = chartX;
        const chartRight = chartX + chartWidth;
        const lineAreaHeight = chartHeight - 20;
        const lineAreaTop = chartTop + 5;
        const lineAreaBottom = chartBottom - 15;
        const lineAreaWidth = chartWidth - 30;

        // Draw chart border
        pdf.setDrawColor(200, 200, 200);
        pdf.rect(chartLeft, chartTop, chartWidth, chartHeight);

        if (data.length === 0) {
          pdf.setFontSize(10);
          pdf.setTextColor(150, 150, 150);
          pdf.text('No data available', chartX + 10, chartTop + chartHeight / 2);
          yPosition = chartBottom + 10;
          return;
        }

        // Find max value for scaling
        const maxValue = Math.max(...data.map(d => Number(d[valueKey]) || 0), 1);
        const pointSpacing = data.length > 1 ? lineAreaWidth / (data.length - 1) : 0;

        // Draw grid lines
        pdf.setDrawColor(230, 230, 230);
        for (let i = 0; i <= 4; i++) {
          const y = lineAreaTop + (i * lineAreaHeight / 4);
          pdf.line(chartLeft + 15, y, chartRight - 15, y);
        }

        // Draw line
        pdf.setDrawColor(0, 204, 231); // Cyan Primary
        pdf.setLineWidth(2);
        const points: number[][] = [];
        data.forEach((item, index) => {
          const value = Number(item[valueKey]) || 0;
          const x = chartLeft + 15 + (index * pointSpacing);
          const y = lineAreaBottom - ((value / maxValue) * lineAreaHeight);
          points.push([x, y]);
        });

        // Draw line connecting points
        for (let i = 0; i < points.length - 1; i++) {
          pdf.line(points[i][0], points[i][1], points[i + 1][0], points[i + 1][1]);
        }

        // Draw points
        pdf.setFillColor(0, 204, 231);
        points.forEach(([x, y]) => {
          pdf.circle(x, y, 2, 'F');
        });

        // Draw labels
        pdf.setFontSize(7);
        pdf.setTextColor(100, 100, 100);
        data.forEach((item, index) => {
          const x = chartLeft + 15 + (index * pointSpacing);
          const label = String(item[dataKey] || '').substring(0, 8);
          pdf.text(label, x, lineAreaBottom + 3, { align: 'center' });
        });

        // Draw Y-axis labels
        pdf.setFontSize(8);
        pdf.setTextColor(100, 100, 100);
        for (let i = 0; i <= 4; i++) {
          const value = (maxValue / 4) * i;
          const y = lineAreaBottom - (i * lineAreaHeight / 4);
          pdf.text(value.toFixed(0), chartLeft + 5, y + 2, { align: 'right' });
        }

        yPosition = chartBottom + 10;
      };

      // Helper function to convert hex to RGB
      const hexToRgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        } : null;
      };


      // Add header with styling
      pdf.setFillColor(0, 204, 231); // Cyan Primary
      pdf.rect(0, 0, pageWidth, 15, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Analytics Report', margin, 12);
      
      yPosition = 25;
      pdf.setTextColor(51, 51, 51);
      pdf.setFont('helvetica', 'normal');

      // Add form info
      if (config) {
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Form: ' + config.title, margin, yPosition);
        yPosition += 8;
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(100, 100, 100);
        pdf.text(`Total Responses: ${filteredResponses.length}`, margin, yPosition);
        yPosition += 10;
      }

      // Add date
      const now = new Date();
      pdf.setFontSize(10);
      pdf.setTextColor(150, 150, 150);
      pdf.text(`Generated: ${now.toLocaleDateString('id-ID', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })}`, margin, yPosition);
      yPosition += 15;

      // Add Responses Over Time Chart
      if (timeSeriesData.length > 0 && filteredResponses.length > 0) {
        drawLineChart('Responses Over Time', timeSeriesData, 'date', 'count');
      }


      // Add all field charts
      for (let i = 0; i < fieldAnalytics.length; i++) {
        const analytics = fieldAnalytics[i];
        
        if (analytics.type === 'distribution') {
          drawBarChart(analytics.field.label, analytics.data, 'name', 'count');
        } else if (analytics.type === 'pie') {
          drawPieChart(analytics.field.label, analytics.data);
        }
      }

      // Add detailed data tables
      const tableWidth = contentWidth;
      const colWidth = tableWidth / 2;

      // Helper function to draw data table
      const drawDataTable = (title: string, data: any[], dataKey: string, valueKey: string) => {
        checkNewPage(60);
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(51, 51, 51);
        pdf.text(title, margin, yPosition);
        yPosition += 8;

        // Draw table header
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(100, 100, 100);
        pdf.setFillColor(240, 240, 240);
        pdf.rect(margin, yPosition, tableWidth, 8, 'F');
        pdf.setDrawColor(200, 200, 200);
        pdf.rect(margin, yPosition, tableWidth, 8);
        pdf.rect(margin, yPosition, colWidth, 8);
        pdf.text('Item', margin + 3, yPosition + 6);
        pdf.text('Value', margin + colWidth + 3, yPosition + 6);
        yPosition += 10;

        // Draw data rows
        pdf.setFontSize(9);
        pdf.setTextColor(51, 51, 51);
        const maxRows = Math.min(data.length, 20);
        for (let i = 0; i < maxRows; i++) {
          checkNewPage(6);
          const item = data[i];
          const label = String(item[dataKey] || '').substring(0, 40);
          const value = item[valueKey] || 0;
          
          pdf.setDrawColor(220, 220, 220);
          pdf.rect(margin, yPosition - 2, tableWidth, 6);
          pdf.rect(margin, yPosition - 2, colWidth, 6);
          
          pdf.text(label, margin + 3, yPosition + 3);
          pdf.text(String(value), margin + colWidth + 3, yPosition + 3);
          yPosition += 6;
        }

        if (data.length > maxRows) {
          pdf.setFontSize(8);
          pdf.setTextColor(150, 150, 150);
          pdf.text(`... and ${data.length - maxRows} more items`, margin + 3, yPosition + 3);
          yPosition += 6;
        }

        yPosition += 5;
      };

      // Add time series table
      if (timeSeriesData.length > 0) {
        checkNewPage(40);
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(51, 51, 51);
        pdf.text('Responses Over Time - Detailed Data', margin, yPosition);
        yPosition += 10;

        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(100, 100, 100);
        pdf.setFillColor(240, 240, 240);
        pdf.rect(margin, yPosition, tableWidth, 8, 'F');
        pdf.setDrawColor(200, 200, 200);
        pdf.rect(margin, yPosition, tableWidth, 8);
        pdf.rect(margin, yPosition, colWidth, 8);
        pdf.text('Date', margin + 3, yPosition + 6);
        pdf.text('Count', margin + colWidth + 3, yPosition + 6);
        yPosition += 10;

        pdf.setFontSize(9);
        pdf.setTextColor(51, 51, 51);
        timeSeriesData.forEach((item: any) => {
          checkNewPage(6);
          pdf.setDrawColor(220, 220, 220);
          pdf.rect(margin, yPosition - 2, tableWidth, 6);
          pdf.rect(margin, yPosition - 2, colWidth, 6);
          
          pdf.text(item.date, margin + 3, yPosition + 3);
          pdf.text(String(item.count), margin + colWidth + 3, yPosition + 3);
          yPosition += 6;
        });
        yPosition += 5;
      }

      // Add field analytics tables
      for (let i = 0; i < fieldAnalytics.length; i++) {
        const analytics = fieldAnalytics[i];
        
        if (analytics.type === 'distribution') {
          drawDataTable(`${analytics.field.label} - Detailed Data`, analytics.data, 'name', 'count');
        } else if (analytics.type === 'pie') {
          drawDataTable(`${analytics.field.label} - Detailed Data`, analytics.data, 'name', 'value');
        }
      }

      // Save PDF
      // Format: Laporan-Analisis-(NamaForm)-(jam-hari-bulan-tahun)
      const formName = (config?.title || 'report').replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-');
      const hour = String(now.getHours()).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const year = now.getFullYear();
      const fileName = `Laporan-Analisis-${formName}-${hour}-${day}-${month}-${year}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      alert('Error exporting to PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6" style={{ fontFamily: 'Roboto, Arial, sans-serif' }}>
      {/* Form Info with Export Button */}
      {config && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-500 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">Analytics untuk</p>
                <p className="text-lg font-semibold text-gray-900">{config.title}</p>
                <p className="text-xs text-gray-500 mt-1">{filteredResponses.length} responses</p>
              </div>
            </div>
            {filteredResponses.length > 0 && (
              <Button
                onClick={exportToPDF}
                disabled={isExporting}
                className="bg-gradient-to-r from-[#00CCE7] to-[#01C0DC] hover:from-[#00B8D4] hover:to-[#00A8C5] text-white shadow-lg disabled:opacity-50"
              >
                {isExporting ? (
                  <>
                    <svg className="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Exporting...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Export to PDF
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Responses Over Time - Always shown */}
      {filteredResponses.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden" data-chart="time-series">
          <div className="px-6 py-5 bg-gradient-to-r from-cyan-50 to-cyan-50 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-500 flex items-center justify-center shadow-md">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Responses Over Time</h3>
            </div>
          </div>
          <div className="p-6">
            {timeSeriesData.length === 0 ? (
              <div className="text-center py-12 text-gray-500">No time series data available</div>
            ) : (
              <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={timeSeriesData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00CCE7" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#01C0DC" stopOpacity={0.3} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
                  <XAxis 
                    dataKey="date" 
                    stroke="#6b7280" 
                    style={{ fontSize: '12px', fontWeight: 500 }}
                    tick={{ fill: '#6b7280' }}
                  />
                  <YAxis 
                    stroke="#6b7280" 
                    style={{ fontSize: '12px', fontWeight: 500 }}
                    tick={{ fill: '#6b7280' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#00CCE7" 
                    strokeWidth={3}
                    dot={{ fill: '#00CCE7', r: 5, strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 7, fill: '#01C0DC' }}
                  />
                  </LineChart>
                </ResponsiveContainer>
            )}
          </div>
        </div>
      )}

      {/* Field-based Analytics */}
      {fieldAnalytics.length === 0 && filteredResponses.length > 0 ? (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-gray-700 font-medium">Tidak ada data analytics yang tersedia</p>
          <p className="text-sm text-gray-500 mt-2">
            Analytics akan muncul untuk field dengan tipe select, radio, checkbox, atau number yang memiliki data
          </p>
        </div>
      ) : (
        fieldAnalytics.map((analytics, index) => {
          // Distribution Chart (Select/Radio)
          if (analytics.type === 'distribution') {
            return (
              <div key={`${analytics.field.id}-${index}`} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden" data-chart={`field-${analytics.field.id}`}>
                <div className="px-6 py-5 bg-gradient-to-r from-cyan-50 to-cyan-50 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-500 flex items-center justify-center shadow-md">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{analytics.field.label}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">Distribution</p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={analytics.data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <defs>
                        <linearGradient id={`barGradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={COLORS[index % COLORS.length]} stopOpacity={1} />
                          <stop offset="100%" stopColor={COLORS[(index + 1) % COLORS.length]} stopOpacity={1} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
                      <XAxis 
                        dataKey="name" 
                        stroke="#6b7280" 
                        style={{ fontSize: '12px', fontWeight: 500 }}
                        tick={{ fill: '#6b7280' }}
                        angle={-45}
                        textAnchor="end"
                        height={100}
                      />
                      <YAxis 
                        stroke="#6b7280" 
                        style={{ fontSize: '12px', fontWeight: 500 }}
                        tick={{ fill: '#6b7280' }}
                      />
                      <Tooltip 
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-white border-2 border-cyan-200 rounded-lg shadow-lg p-3">
                                <p className="font-semibold text-gray-900 mb-1">{data.fullName || data.name}</p>
                                <p className="text-sm text-[#00CCE7]">
                                  Count: <span className="font-semibold">{data.count}</span>
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar 
                        dataKey="count" 
                        fill={`url(#barGradient-${index})`}
                        radius={[8, 8, 0, 0]}
                        stroke={COLORS[index % COLORS.length]}
                        strokeWidth={1}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            );
          }

          // Pie Chart (Checkbox)
          if (analytics.type === 'pie') {
            return (
              <div key={`${analytics.field.id}-${index}`} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden" data-chart={`field-${analytics.field.id}`}>
                <div className="px-6 py-5 bg-gradient-to-r from-cyan-50 to-cyan-50 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-500 flex items-center justify-center shadow-md">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{analytics.field.label}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">Distribution</p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex flex-col items-center">
                    <ResponsiveContainer width="100%" height={350}>
                      <PieChart>
                        <Pie
                          data={analytics.data}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={(props: any) => {
                            const name = props.name || '';
                            const percent = props.percent || 0;
                            return `${name}: ${(percent * 100).toFixed(0)}%`;
                          }}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {analytics.data.map((_entry: any, idx: number) => (
                            <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex flex-wrap gap-4 mt-4 justify-center">
                      {analytics.data.map((entry: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-2">
                          <div
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                          />
                          <span className="text-sm text-gray-700 font-medium">
                            {entry.name}: {entry.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          // Statistics (Number)
          if (analytics.type === 'statistics') {
            return (
              <div key={`${analytics.field.id}-${index}`} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="px-6 py-5 bg-gradient-to-r from-cyan-50 to-cyan-50 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-500 flex items-center justify-center shadow-md">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{analytics.field.label}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">Statistics</p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-cyan-50 to-cyan-50 rounded-lg p-4 border border-cyan-200">
                      <p className="text-xs text-gray-600 mb-1">Rata-rata</p>
                      <p className="text-2xl font-bold text-[#00CCE7]">{analytics.data.average.toFixed(2)}</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                      <p className="text-xs text-gray-600 mb-1">Minimum</p>
                      <p className="text-2xl font-bold text-green-600">{analytics.data.min}</p>
                    </div>
                    <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg p-4 border border-orange-200">
                      <p className="text-xs text-gray-600 mb-1">Maximum</p>
                      <p className="text-2xl font-bold text-orange-600">{analytics.data.max}</p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                      <p className="text-xs text-gray-600 mb-1">Total</p>
                      <p className="text-2xl font-bold text-blue-600">{analytics.data.total.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">
                      Berdasarkan <span className="font-semibold">{analytics.data.count}</span> responses
                    </p>
                  </div>
                </div>
              </div>
            );
          }

          return null;
        })
      )}

      {/* No responses message */}
      {filteredResponses.length === 0 && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-gray-700 font-medium">Belum ada responses</p>
          <p className="text-sm text-gray-500 mt-2">Analytics akan muncul setelah ada responses</p>
        </div>
      )}
    </div>
  );
}
