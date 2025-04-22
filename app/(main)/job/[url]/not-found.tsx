import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { ArrowLeft, Search, AlertTriangle } from "lucide-react";

export default function JobNotFound() {
  return (
    <div className="container py-12 max-w-md mx-auto">
      <Card className="text-center">
        <CardHeader>
          <div className="mx-auto rounded-full bg-muted p-4 mb-2">
            <AlertTriangle className="h-10 w-10 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold mb-1">Job Not Found</h1>
          <p className="text-muted-foreground">
            We couldn't find the job you're looking for. It may have been removed or the URL might be incorrect.
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="bg-muted p-4 rounded-lg text-sm text-muted-foreground">
            <p>Job listings are updated frequently. The position you're looking for might have been filled or removed by the employer.</p>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col gap-3">
          <Button className="w-full" asChild>
            <Link href="/chatbot">
              <Search className="mr-2 h-4 w-4" /> Find More Jobs
            </Link>
          </Button>
          
          <Button variant="outline" className="w-full" asChild>
            <Link href="/" className="flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" /> Return to Home
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 