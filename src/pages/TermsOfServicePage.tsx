import { SeoPageLayout } from "@/components/seo";

const TermsOfServicePage = () => {
  return (
    <SeoPageLayout title="Terms of Service" description="Last updated: April 1, 2026">
      <h2>1. Acceptance of Terms</h2>
      <p>
        By accessing or using the OmenX platform ("Service"), you agree to be bound by these Terms of Service ("Terms").
        If you do not agree, you may not use the Service.
      </p>

      <h2>2. Eligibility</h2>
      <p>
        You must be at least 18 years old and legally eligible in your jurisdiction to use the Service.
        Users from sanctioned countries or regions where event trading is prohibited are not permitted to use OmenX.
      </p>

      <h2>3. Account Responsibilities</h2>
      <ul>
        <li>You are responsible for maintaining the security of your account credentials.</li>
        <li>You must provide accurate and complete information during registration.</li>
        <li>You may not create multiple accounts or share accounts with others.</li>
        <li>You are liable for all activity that occurs under your account.</li>
      </ul>

      <h2>4. Trading Rules</h2>
      <h3>4.1 Event Markets</h3>
      <p>
        OmenX provides markets based on real-world event outcomes. All trades are executed through
        our order book system. Prices reflect market consensus and do not constitute financial advice.
      </p>

      <h3>4.2 Settlement</h3>
      <p>
        Events are settled based on verifiable outcomes from designated data sources. OmenX's
        determination of event outcomes is final. Winning options settle at $1.00; losing options at $0.00.
      </p>

      <h3>4.3 Leverage & Risk</h3>
      <p>
        Leveraged trading carries significant risk. You may lose your entire margin on a position.
        OmenX is not responsible for losses resulting from your trading decisions.
      </p>

      <h3>4.4 Prohibited Activities</h3>
      <ul>
        <li>Market manipulation, wash trading, or spoofing</li>
        <li>Using insider information to trade on event outcomes</li>
        <li>Exploiting platform bugs or vulnerabilities</li>
        <li>Using automated systems without authorization</li>
        <li>Attempting to circumvent risk controls or position limits</li>
      </ul>

      <h2>5. Funds & Transactions</h2>
      <h3>5.1 Deposits</h3>
      <p>
        Deposits are processed via supported blockchain networks. You are responsible for sending
        the correct token to the correct network address. Funds sent to incorrect addresses may be
        permanently lost.
      </p>

      <h3>5.2 Withdrawals</h3>
      <p>
        Withdrawals are subject to security review and processing times. OmenX may delay or refuse
        withdrawals if suspicious activity is detected.
      </p>

      <h3>5.3 Trial Funds</h3>
      <p>
        Trial funds are virtual credits for practice trading. They have no cash value, cannot be
        withdrawn, and may be modified or revoked at our discretion.
      </p>

      <h2>6. Intellectual Property</h2>
      <p>
        All content, design, software, and data on OmenX are owned by or licensed to us. You may not
        copy, modify, distribute, or reverse-engineer any part of the Service without written permission.
      </p>

      <h2>7. Disclaimers</h2>
      <p>
        The Service is provided "as is" without warranties of any kind, express or implied. OmenX does not
        guarantee uninterrupted service, error-free operation, or specific trading outcomes. Event trading
        involves substantial risk of loss.
      </p>

      <h2>8. Limitation of Liability</h2>
      <p>
        To the maximum extent permitted by law, OmenX shall not be liable for any indirect, incidental,
        special, consequential, or punitive damages, including loss of profits, trading losses, or data loss.
      </p>

      <h2>9. Indemnification</h2>
      <p>
        You agree to indemnify and hold harmless OmenX and its officers, directors, employees, and agents
        from any claims, damages, losses, or expenses arising from your use of the Service or violation of
        these Terms.
      </p>

      <h2>10. Modifications</h2>
      <p>
        We reserve the right to modify these Terms at any time. Material changes will be communicated
        via email or in-app notification. Continued use after changes constitutes acceptance.
      </p>

      <h2>11. Termination</h2>
      <p>
        We may suspend or terminate your account at any time for violation of these Terms or for any
        other reason at our discretion. Upon termination, you may withdraw eligible funds subject to
        applicable review processes.
      </p>

      <h2>12. Governing Law</h2>
      <p>
        These Terms shall be governed by and construed in accordance with applicable laws. Any disputes
        shall be resolved through binding arbitration.
      </p>

      <h2>13. Contact</h2>
      <p>
        For questions about these Terms: <strong>legal@omenx.io</strong>
      </p>
    </SeoPageLayout>
  );
};

export default TermsOfServicePage;
