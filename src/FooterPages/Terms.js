import React from 'react';
import Header from "../components/Header";
import './Terms.css';

const Terms = () => {

    return (
        <>
            <Header />
            <div className="terms-container">
                <h1>Terms of Service</h1>
                <section>
                    <h2>1. Introduction</h2>
                    <p>Welcome to The Pioneer, the official student newspaper for the Cooper Union for the Advancement of
                        Science and Art. By accessing our website, you agree to be bound by these Terms of Service and
                        acknowledge our Privacy Policy.</p>
                </section>
                <section>
                    <h2>2. Ethical Use of The Platform</h2>
                    <p>As guided by the ACM Code of Ethics, users are expected to act with integrity and respect when
                        interacting with our services and other users. Unlawful, misleading, or unethical conduct is
                        strictly prohibited.</p>
                    <p>Users are encouraged to foster an environment of support and respect, contributing to informed and
                        thoughtful discussions.</p>
                </section>
                <section>
                    <h2>3. User Accounts</h2>
                    <p>Users are responsible for maintaining the confidentiality of their account information, including
                        passwords. Users must notify us immediately of any unauthorized use of their accounts.</p>
                    <p>Accounts must be used only for lawful, ethical, and respectful purposes.</p>
                </section>
                <section>
                    <h2>4. Submission of Content</h2>
                    <p>Users may submit content for publication. By doing so, they grant The Pioneer a non-exclusive,
                        worldwide, royalty-free license to publish the content online or in print.</p>
                    <p>Submissions must respect intellectual property rights and should not include plagiarized, defamatory,
                        or otherwise unethical content.</p>
                </section>
                <section>
                    <h2>5. Intellectual Property</h2>
                    <p>Content published on The Pioneer, including articles, images, and graphics, is protected by intellectual property laws. You may not use such content without express permission unless for non-commercial educational purposes.</p>
                    <p>Respect for the intellectual work of others is paramount, reflecting the professional and ethical standards outlined by the ACM Code.</p>
                </section>
                <section>
                    <h2>6. Modification of Terms</h2>
                    <p>We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting, and continued use of the site after changes have been posted signifies acceptance.</p>
                </section>
                <section>
                    <h2>7. Governing Law</h2>
                    <p>These Terms are governed by the laws of the state of New York, without regard to its conflict of law principles.</p>

                </section>
                <section>
                    <h2>8. Contact Information</h2>
                    <p>For any questions or concerns regarding these Terms, please contact us via email at [Contact Email].</p>

                </section>

            </div>
        </>
    );
};

export default Terms;
