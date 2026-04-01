import { SeoPageLayout } from "@/components/seo";

const PrivacyPolicyPage = () => {
  return (
    <SeoPageLayout title="Privacy Policy" description="Last updated: April 1, 2026">
      <h2>1. Introduction</h2>
      <p>
        OmenX ("we", "our", "us") is committed to protecting your privacy. This Privacy Policy explains how we collect,
        use, disclose, and safeguard your information when you use the OmenX platform (the "Service").
      </p>

      <h2>2. Information We Collect</h2>
      <h3>2.1 Account Information</h3>
      <p>
        When you create an account, we collect your email address, display name, and authentication credentials.
        If you sign in via third-party providers (Google, Telegram), we receive basic profile information as
        authorized by you.
      </p>

      <h3>2.2 Trading Data</h3>
      <p>
        We record all trades, orders, positions, and transaction history associated with your account.
        This data is essential for platform operation, risk management, and regulatory compliance.
      </p>

      <h3>2.3 Wallet Information</h3>
      <p>
        When you deposit or withdraw funds, we collect blockchain wallet addresses and transaction hashes.
        We do not store private keys — only public addresses necessary for processing transactions.
      </p>

      <h3>2.4 Usage Data</h3>
      <p>
        We automatically collect device information, browser type, IP address, pages visited, and interaction
        patterns to improve the Service and detect suspicious activity.
      </p>

      <h2>3. How We Use Your Information</h2>
      <ul>
        <li>Provide, maintain, and improve the Service</li>
        <li>Process trades, deposits, and withdrawals</li>
        <li>Calculate account balances, PnL, and risk metrics</li>
        <li>Detect and prevent fraud, abuse, and unauthorized access</li>
        <li>Send important notifications about your account and trades</li>
        <li>Comply with legal and regulatory obligations</li>
        <li>Analyze usage patterns to improve user experience</li>
      </ul>

      <h2>4. Data Sharing</h2>
      <p>We do not sell your personal information. We may share data with:</p>
      <ul>
        <li><strong>Service Providers</strong> — Third-party services that help operate the platform (hosting, analytics, payment processing)</li>
        <li><strong>Legal Authorities</strong> — When required by law, regulation, or legal process</li>
        <li><strong>Business Transfers</strong> — In connection with a merger, acquisition, or asset sale</li>
      </ul>

      <h2>5. Data Security</h2>
      <p>
        We implement industry-standard security measures including encryption in transit (TLS) and at rest,
        secure authentication, access controls, and regular security audits. However, no system is completely
        secure, and we cannot guarantee absolute security.
      </p>

      <h2>6. Data Retention</h2>
      <p>
        We retain your account and trading data for as long as your account is active and for a period
        thereafter as required by applicable regulations. You may request account deletion, subject to
        regulatory retention requirements.
      </p>

      <h2>7. Your Rights</h2>
      <p>Depending on your jurisdiction, you may have the right to:</p>
      <ul>
        <li>Access and receive a copy of your personal data</li>
        <li>Correct inaccurate information</li>
        <li>Request deletion of your data (subject to legal obligations)</li>
        <li>Object to or restrict certain processing</li>
        <li>Data portability</li>
      </ul>

      <h2>8. Cookies</h2>
      <p>
        We use essential cookies for authentication and session management. We may also use analytics
        cookies to understand platform usage. You can manage cookie preferences through your browser settings.
      </p>

      <h2>9. Children's Privacy</h2>
      <p>
        The Service is not intended for users under 18 years of age. We do not knowingly collect
        information from children.
      </p>

      <h2>10. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. We will notify you of material changes
        via email or in-app notification. Continued use of the Service after changes constitutes acceptance.
      </p>

      <h2>11. Contact Us</h2>
      <p>
        For privacy-related inquiries: <strong>privacy@omenx.io</strong>
      </p>
    </SeoPageLayout>
  );
};

export default PrivacyPolicyPage;
