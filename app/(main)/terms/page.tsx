import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <Link 
        href="/" 
        className="inline-flex items-center text-gray-600 hover:text-purple-600 transition mb-8"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back to Home
      </Link>
      
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Use</h1>
      
      <div className="prose prose-purple max-w-none">
        <p className="text-lg mb-6">Last Updated: {new Date().toLocaleDateString()}</p>
        
        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing and using empowHER, you agree to be bound by these Terms of Use and all applicable laws and regulations. 
          If you do not agree with any of these terms, you are prohibited from using or accessing this site.
        </p>
        
        <h2>2. Use License</h2>
        <p>
          Permission is granted to temporarily access the materials on empowHER's website for personal, non-commercial use. 
          This is the grant of a license, not a transfer of title, and under this license you may not:
        </p>
        <ul>
          <li>Modify or copy the materials</li>
          <li>Use the materials for any commercial purpose</li>
          <li>Attempt to decompile or reverse engineer any software contained on empowHER's website</li>
          <li>Remove any copyright or other proprietary notations from the materials</li>
          <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
        </ul>
        
        <h2>3. Disclaimer</h2>
        <p>
          The materials on empowHER's website are provided on an 'as is' basis. empowHER makes no warranties, 
          expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, 
          implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement 
          of intellectual property or other violation of rights.
        </p>
        
        <h2>4. Limitations</h2>
        <p>
          In no event shall empowHER or its suppliers be liable for any damages (including, without limitation, 
          damages for loss of data or profit, or due to business interruption) arising out of the use or inability 
          to use the materials on empowHER's website, even if empowHER or an empowHER authorized representative has 
          been notified orally or in writing of the possibility of such damage.
        </p>
        
        <h2>5. Revisions</h2>
        <p>
          The materials appearing on empowHER's website could include technical, typographical, or photographic errors. 
          empowHER does not warrant that any of the materials on its website are accurate, complete or current. 
          empowHER may make changes to the materials contained on its website at any time without notice.
        </p>
        
        <h2>6. Links</h2>
        <p>
          empowHER has not reviewed all of the sites linked to its website and is not responsible for the contents of 
          any such linked site. The inclusion of any link does not imply endorsement by empowHER of the site. 
          Use of any such linked website is at the user's own risk.
        </p>
        
        <h2>7. Modifications</h2>
        <p>
          empowHER may revise these terms of service for its website at any time without notice. By using this website 
          you are agreeing to be bound by the then current version of these terms of service.
        </p>
        
        <h2>8. Governing Law</h2>
        <p>
          These terms and conditions are governed by and construed in accordance with the laws and you irrevocably 
          submit to the exclusive jurisdiction of the courts in that location.
        </p>
      </div>
    </div>
  );
} 