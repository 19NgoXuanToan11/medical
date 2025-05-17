# Vaccination Management UI Flow

## Overview

This document outlines the complete UI flow for the vaccination management process at schools. The process consists of four main stages:

1. **Send Notification Forms**: School staff sends vaccination consent forms to parents
2. **Prepare Student List**: Staff prepares the list of students based on parent consent responses
3. **Vaccination Process**: Recording of actual vaccination administration
4. **Post-vaccination Monitoring**: Monitoring students after vaccination and generating reports

## User Roles

- **School Staff/Nurse**: Manages the entire vaccination process
- **Parents**: Provide consent for their children's vaccination
- **Healthcare Providers**: Administer vaccines (may use the system to record results)

## Detailed Flow

### Step 1: Send Notification Forms

**Staff View**:

1. Staff selects the class, vaccine type, and vaccination date
2. Staff writes or selects a template for the notification message
3. System generates personalized consent forms for each student
4. Staff sends notifications to parents (via app notification, email, or SMS)
5. System tracks delivery and response status

**Parent View**:

1. Parent receives notification with link to consent form
2. Parent reviews vaccination information
3. Parent selects "Agree" or "Disagree"
4. If "Agree", parent provides electronic signature
5. Parent submits the form
6. System confirms submission and sends receipt

### Step 2: Prepare Student List

**Staff View**:

1. Staff views the dashboard showing consent status by class
2. Staff can filter and search for specific students
3. System color-codes students based on consent status:
   - Green: Consent given
   - Red: Consent denied
   - Gray: No response yet
4. Staff can send reminders to non-responding parents
5. Staff finalizes the vaccination list based on consents received
6. System generates printable lists for healthcare providers

### Step 3: Vaccination Process

**Staff/Healthcare Provider View**:

1. Staff views the finalized list of students with consent
2. As each student receives vaccination, staff marks them as "Vaccinated"
3. Staff can record any immediate reactions or notes
4. System updates vaccination status in real-time
5. Staff can view progress statistics during the vaccination session

### Step 4: Post-vaccination Monitoring

**Staff View**:

1. Staff monitors students for 30 minutes after vaccination
2. Staff records any adverse reactions or concerns
3. System categorizes reactions by severity
4. Staff can add follow-up notes for specific students
5. System generates summary reports of the vaccination session
6. Staff can export data for official health records
