import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const PrivacyPolicy = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Privacy Policy
      </Typography>
      <Typography variant="body1">
          {/* Replace with your Privacy Policy Content from above. */}
          {/* IMPORTANT: This is sample text. Replace with your actual Privacy Policy. */}
        <p>Last Updated: [Date]</p>

        <p><strong>1. Introduction</strong></p>

        <p>ZenFlector ("we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application ("App"). Please read this policy carefully. By using the App, you consent to the data practices described in this policy.</p>

        <p><strong>2. Information We Collect</strong></p>

        <p>We may collect the following types of information:</p>

        <p><strong>a. Personal Information:</strong></p>
        <ul>
            <li><strong>Email Address:</strong> We collect your email address when you create an account.</li>
            <li><strong>Name:</strong> We collect your name (optional) when you create an account or update your profile.</li>
            <li><strong>Profile Picture:</strong> You may optionally upload a profile picture.</li>
            <li><strong>User ID:</strong> We assign a unique user ID to your account. This is <em>not</em> personally identifiable information on its own, but it is linked to your account.</li>
        </ul>

        <p><strong>b. Usage Data:</strong></p>
        <ul>
            <li><strong>Audio Preferences:</strong> We collect information about the genres, playlists, and specific audio tracks you listen to, mark as favorites, or add to playlists. This data is used to personalize your experience and provide recommendations.</li>
            <li><strong>Listening History:</strong> We may track when and how often you listen to audio content.</li>
            <li><strong>App Usage:</strong> We collect data on how you interact with the App's features (e.g., settings changes, button clicks). This is for analytics and improvement purposes.</li>
            <li><strong>Bluetooth Connection:</strong> We collect information about your Bluetooth connection to your headband (connection status, device name). We <em>do not</em> collect any health data or other sensitive data from the headband.</li>
        </ul>


        <p><strong>c. Device Information:</strong></p>
          <ul>
            <li><strong>Device Model:</strong> We may collect information about the type of device you use to access the App (e.g., phone model, operating system version). This is for compatibility and troubleshooting purposes.</li>
            <li><strong>IP Address:</strong> We may collect your IP address. This is used for general location information (e.g., country-level) and for security purposes.</li>
          </ul>

        <p><strong>d. Data from Firebase:</strong></p>
          <ul><li>Our App uses Firebase services from Google.  Information such as User ID, and crash reports are stored.</li></ul>

        <p><strong>3. How We Use Your Information</strong></p>

        <p>We use your information for the following purposes:</p>
          <ul>
            <li><strong>To Provide and Maintain the App:</strong> This includes creating and managing your account, providing audio playback, and enabling features like playlists and favorites.</li>
            <li><strong>To Personalize Your Experience:</strong> We use your listening preferences and history to suggest content you might enjoy.</li>
            <li><strong>To Improve the App:</strong> We use usage data to identify areas for improvement, fix bugs, and develop new features.</li>
            <li><strong>To Communicate with You:</strong> We may use your email address to send you important updates, announcements, or support messages. We will <em>not</em> send marketing emails without your explicit consent.</li>
            <li>To comply with legal requirements.</li>
          </ul>

        <p><strong>4. How We Share Your Information</strong></p>
          <p>We will not share, information that we collected from user, with any third parties.</p>

        <p><strong>5. Data Security</strong></p>

        <p>We use industry-standard security measures to protect your information from unauthorized access, use, or disclosure. These measures include data encryption, secure servers, and access controls. However, no method of transmission over the internet or electronic storage is 100% secure.</p>

        <p><strong>6. Your Data Rights</strong></p>

        <p>You have the following rights regarding your personal information:</p>
        <ul>
          <li><strong>Access:</strong>  You can request access to the personal information we hold about you.</li>
          <li><strong>Correction:</strong> You can request that we correct any inaccurate or incomplete information.</li>
          <li><strong>Deletion:</strong>  You can request that we delete your personal information, subject to certain legal exceptions.</li>
          <li><strong>Objection:</strong> You can object to the processing of your personal information in certain circumstances.</li>
        </ul>

        <p>To exercise these rights, please contact us at [Your Contact Email Address].</p>

        <p><strong>7. Children's Privacy</strong></p>
        <p>Our App is not intended for use by children under the age of [Age - e.g., 13]. We do not knowingly collect personal information from children under this age. If we become aware that we have collected personal information from a child, we will take steps to delete it.</p>


        <p><strong>8. Changes to This Privacy Policy</strong></p>
        <p>We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new Privacy Policy within the App and updating the "Last Updated" date.</p>


        <p><strong>9. Contact Us</strong></p>
        <p>If you have any questions about this Privacy Policy, please contact us at:</p>
        <p>[zenflector@gmail.com]<br/></p>
      </Typography>
    </Box>
  );
};

export default PrivacyPolicy;