import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <Link 
        href="/" 
        className="inline-flex items-center text-gray-600 hover:text-purple-600 transition mb-8"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back to Home
      </Link>
      
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
      
      <div className="prose prose-purple max-w-none">
        <p className="text-lg mb-6">Last Updated: {new Date().toLocaleDateString()}</p>
        
        <p>
          At empowHER, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, 
          and safeguard your information when you use our platform. Please read this privacy policy carefully. 
          If you do not agree with the terms of this privacy policy, please do not access the site.
        </p>
        
        <h2>Information We Collect</h2>
        <p>We may collect information about you in various ways:</p>
        <ul>
          <li>
            <strong>Personal Data:</strong> Personally identifiable information, such as your name, email address, 
            telephone number, and demographic information that you voluntarily give to us when you register with our 
            platform or when you choose to participate in various activities related to our service.
          </li>
          <li>
            <strong>Derivative Data:</strong> Information our servers automatically collect when you access our platform, 
            such as your IP address, browser type, operating system, access times, and the pages you have viewed.
          </li>
          <li>
            <strong>Financial Data:</strong> Financial information, such as data related to your payment method (e.g., valid credit card number, card type, expiration date) that we may collect when you purchase, order, or use our services.
          </li>
        </ul>
        
        <h2>Use of Your Information</h2>
        <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:</p>
        <ul>
          <li>Create and manage your account</li>
          <li>Email you regarding your account or other opportunities</li>
          <li>Fulfill and manage purchases, orders, payments, and other transactions related to the platform</li>
          <li>Increase the efficiency and operation of the platform</li>
          <li>Monitor and analyze usage and trends to improve your experience with the platform</li>
          <li>Develop new products, services, features, and functionality</li>
        </ul>
        
        <h2>Disclosure of Your Information</h2>
        <p>We may share information we have collected about you in certain situations. Your information may be disclosed as follows:</p>
        <ul>
          <li>
            <strong>By Law or to Protect Rights:</strong> If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law, rule, or regulation.
          </li>
          <li>
            <strong>Third-Party Service Providers:</strong> We may share your information with third parties that perform services for us or on our behalf, including payment processing, data analysis, email delivery, hosting services, customer service, and marketing assistance.
          </li>
          <li>
            <strong>Marketing Communications:</strong> With your consent, or with an opportunity for you to withdraw consent, we may share your information with third parties for marketing purposes.
          </li>
        </ul>
        
        <h2>Security of Your Information</h2>
        <p>
          We use administrative, technical, and physical security measures to help protect your personal information. 
          While we have taken reasonable steps to secure the personal information you provide to us, please be aware 
          that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission 
          can be guaranteed against any interception or other type of misuse.
        </p>
        
        <h2>Contact Us</h2>
        <p>
          If you have questions or comments about this Privacy Policy, please contact us at:
        </p>
        <p>
          empowHER<br />
          contact@empowher.com<br />
          123 Main Street<br />
          San Francisco, CA 94103
        </p>
      </div>
    </div>
  );
} 