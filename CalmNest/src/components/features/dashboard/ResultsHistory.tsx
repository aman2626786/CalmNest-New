'use client';

import { useResults } from '@/context/ResultsContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export const ResultsHistory = () => {
  const { results } = useResults();

  if (results.length === 0) {
    return (
      <Card className="bg-gray-900/50 border-purple-500/20">
        <CardHeader>
          <CardTitle>Results History</CardTitle>
        </CardHeader>
        <CardContent>
          <p>No results yet. Take a self-check test to see your history.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-900/50 border-purple-500/20">
      <CardHeader>
        <CardTitle>Results History</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {results.map((result, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger>
                <div className="flex justify-between w-full pr-4">
                  <span>{result.testType} - {new Date(result.date).toLocaleDateString()}</span>
                  <span>Score: {result.score} ({result.severity})</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                {Array.isArray(result.answers) && result.answers.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Question</TableHead>
                        <TableHead>Selected Option</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {result.answers.map((answer, i) => (
                        <TableRow key={i}>
                          <TableCell>{answer.question}</TableCell>
                          <TableCell>{answer.option}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-gray-400 italic">Detailed answers are not available for this entry.</p>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
};
