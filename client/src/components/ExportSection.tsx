import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useExportData } from '@/hooks/useSEOHistory';
import { SEOMetaTag } from '@shared/schema';
import { jsPDF } from 'jspdf';
import { 
  DownloadIcon, 
  Share2Icon, 
  CopyIcon, 
  FileTextIcon,
  FileSpreadsheetIcon,
  FileImageIcon,
  LinkIcon,
  CheckIcon
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from './ui/skeleton';

interface ExportSectionProps {
  url: string;
  seoData: SEOMetaTag;
}

export default function ExportSection({ url, seoData }: ExportSectionProps) {
  const [copied, setCopied] = useState(false);
  const exportQuery = useExportData(url);
  
  const generateCSV = () => {
    try {
      // Create report data in CSV format
      const reportDate = new Date().toLocaleDateString();
      const csvContent = [
        // Headers
        ['SEO Analysis Report', '', ''],
        [`URL: ${url}`, '', ''],
        [`Date: ${reportDate}`, '', ''],
        [`Overall Score: ${seoData.score || 0}/100`, '', ''],
        ['', '', ''],
        ['Factor', 'Status', 'Details'],
        
        // Content rows
        ['Title Tag', seoData.statusChecks?.title?.status || 'not analyzed', seoData.statusChecks?.title?.message || ''],
        ['Meta Description', seoData.statusChecks?.description?.status || 'not analyzed', seoData.statusChecks?.description?.message || ''],
        ['Canonical URL', seoData.statusChecks?.canonical?.status || 'not analyzed', seoData.statusChecks?.canonical?.message || ''],
        ['Social Tags', seoData.statusChecks?.social?.status || 'not analyzed', seoData.statusChecks?.social?.message || ''],
        ['Heading Structure', seoData.h1?.length === 1 ? 'good' : 'needs improvement', `H1: ${seoData.h1?.length || 0}, H2: ${seoData.h2?.length || 0}, H3: ${seoData.h3?.length || 0}`],
        ['', '', ''],
        ['Recommendations:', '', ''],
      ];
      
      // Add recommendations if available
      if (seoData.recommendations && seoData.recommendations.length > 0) {
        seoData.recommendations.forEach((rec, index) => {
          csvContent.push([`${index + 1}. ${rec.title}`, rec.type, rec.description]);
        });
      }
      
      // Convert arrays to CSV string
      const csv = csvContent.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
      
      // Create a blob and download link
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', downloadUrl);
      link.setAttribute('download', `seo-report-${url.replace(/[^a-z0-9]/gi, '-')}-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: 'Export Successful',
        description: 'Your SEO report has been exported as a CSV file',
      });
    } catch (err) {
      console.error('Error generating CSV:', err);
      toast({
        title: 'Export Failed',
        description: 'Failed to export CSV report. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  const generatePDF = () => {
    try {
      // Create new PDF document
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      const contentWidth = pageWidth - (margin * 2);
      
      // Add title
      doc.setFontSize(20);
      doc.setTextColor(33, 33, 33);
      doc.text('SEO Analysis Report', margin, 20);
      
      // Add URL and date
      doc.setFontSize(12);
      doc.setTextColor(80, 80, 80);
      doc.text(`URL: ${url}`, margin, 30);
      doc.text(`Date: ${new Date().toLocaleDateString()}`, margin, 38);
      doc.text(`Score: ${seoData.score || 0}/100`, margin, 46);
      
      // Add horizontal line
      doc.setDrawColor(220, 220, 220);
      doc.line(margin, 50, pageWidth - margin, 50);
      
      // Add key findings section
      doc.setFontSize(16);
      doc.setTextColor(33, 33, 33);
      doc.text('Key Findings', margin, 60);
      
      // Add status checks
      let yPos = 70;
      const statusChecks = seoData.statusChecks || {};
      const factors = [
        { name: 'Title Tag', key: 'title' },
        { name: 'Meta Description', key: 'description' },
        { name: 'Canonical URL', key: 'canonical' },
        { name: 'Social Tags', key: 'social' },
      ];
      
      factors.forEach(factor => {
        const check = statusChecks[factor.key];
        doc.setFontSize(12);
        doc.setTextColor(33, 33, 33);
        doc.text(`${factor.name}:`, margin, yPos);
        
        const status = check?.status || 'not analyzed';
        let statusColor;
        switch (status) {
          case 'good':
            statusColor = [46, 125, 50]; // Green
            break;
          case 'warning':
            statusColor = [237, 108, 2]; // Orange
            break;
          case 'error':
            statusColor = [211, 47, 47]; // Red
            break;
          default:
            statusColor = [117, 117, 117]; // Gray
        }
        
        doc.setTextColor(...statusColor);
        doc.text(status.toUpperCase(), margin + 60, yPos);
        
        doc.setTextColor(117, 117, 117);
        const message = check?.message || 'No details available';
        doc.text(message, margin, yPos + 8, { maxWidth: contentWidth });
        
        yPos += 20;
      });
      
      // Add recommendations section
      yPos += 10;
      doc.setFontSize(16);
      doc.setTextColor(33, 33, 33);
      doc.text('Recommendations', margin, yPos);
      
      if (seoData.recommendations && seoData.recommendations.length > 0) {
        yPos += 10;
        seoData.recommendations.forEach((rec, index) => {
          // Check if we need a new page
          if (yPos > 270) {
            doc.addPage();
            yPos = 20;
          }
          
          doc.setFontSize(12);
          doc.setTextColor(33, 33, 33);
          doc.text(`${index + 1}. ${rec.title}`, margin, yPos);
          
          doc.setTextColor(117, 117, 117);
          doc.setFontSize(10);
          const splitDesc = doc.splitTextToSize(rec.description, contentWidth);
          doc.text(splitDesc, margin, yPos + 8);
          
          yPos += 10 + (splitDesc.length * 6);
        });
      } else {
        yPos += 10;
        doc.setFontSize(12);
        doc.setTextColor(117, 117, 117);
        doc.text('No recommendations available', margin, yPos);
      }
      
      // Add copyright footer
      const footerText = `© ${new Date().getFullYear()} Ari Berkowitz - SEO Tag Inspector`;
      doc.setFontSize(10);
      doc.setTextColor(150, 150, 150);
      doc.text(footerText, pageWidth / 2, 285, { align: 'center' });
      
      // Save the PDF
      doc.save(`seo-report-${url.replace(/[^a-z0-9]/gi, '-')}-${new Date().toISOString().split('T')[0]}.pdf`);
      
      toast({
        title: 'Export Successful',
        description: 'Your SEO report has been exported as a PDF',
      });
    } catch (err) {
      console.error('Error generating PDF:', err);
      toast({
        title: 'Export Failed',
        description: 'Failed to export PDF report. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  const generateShareableLink = async () => {
    exportQuery.refetch();
    try {
      // Create a base64 representation of the report data
      const json = JSON.stringify({
        url,
        data: seoData,
        timestamp: new Date().toISOString()
      });
      
      const base64Data = btoa(encodeURIComponent(json));
      const shareableUrl = `${window.location.origin}?report=${base64Data}`;
      
      await navigator.clipboard.writeText(shareableUrl);
      setCopied(true);
      
      toast({
        title: 'Link Copied',
        description: 'Shareable link has been copied to clipboard',
      });
      
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error('Error generating shareable link:', err);
      toast({
        title: 'Link Generation Failed',
        description: 'Could not generate shareable link. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="flex items-center">
          <DownloadIcon className="mr-2 h-5 w-5 text-primary" />
          Export & Share
        </CardTitle>
        <CardDescription>Download reports or share this analysis with others</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="export">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="export">
              <DownloadIcon className="mr-2 h-4 w-4" />
              Export Report
            </TabsTrigger>
            <TabsTrigger value="share">
              <Share2Icon className="mr-2 h-4 w-4" />
              Share Analysis
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="export" className="mt-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex flex-col items-center justify-between rounded-lg border p-4 text-center">
                <div className="mb-4 mt-2">
                  <FileTextIcon className="h-12 w-12 text-primary" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-medium">PDF Report</h3>
                  <p className="text-xs text-muted-foreground">Download a detailed PDF report with all analysis results</p>
                </div>
                <Button onClick={generatePDF} variant="outline" className="mt-4 w-full">
                  <DownloadIcon className="mr-2 h-4 w-4" />
                  Download PDF
                </Button>
              </div>
              
              <div className="flex flex-col items-center justify-between rounded-lg border p-4 text-center">
                <div className="mb-4 mt-2">
                  <FileSpreadsheetIcon className="h-12 w-12 text-success" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-medium">CSV Export</h3>
                  <p className="text-xs text-muted-foreground">Export raw data to CSV for spreadsheet analysis</p>
                </div>
                <Button onClick={generateCSV} variant="outline" className="mt-4 w-full">
                  <DownloadIcon className="mr-2 h-4 w-4" />
                  Export CSV
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="share" className="mt-4">
            <div className="rounded-lg border p-4">
              <div className="flex flex-col items-center justify-center text-center p-2">
                <LinkIcon className="mb-4 h-12 w-12 text-primary" />
                <h3 className="text-base font-medium">Create Shareable Link</h3>
                <p className="mb-6 mt-1 text-sm text-muted-foreground">
                  Generate a link to share this SEO analysis with your team or clients
                </p>
                
                <Button onClick={generateShareableLink} variant="default" className="w-full sm:w-auto">
                  {copied ? (
                    <>
                      <CheckIcon className="mr-2 h-4 w-4" />
                      Link Copied!
                    </>
                  ) : (
                    <>
                      <CopyIcon className="mr-2 h-4 w-4" />
                      Copy Shareable Link
                    </>
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}