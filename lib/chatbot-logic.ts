import scholarshipData from '@/data/scholarship-data.json';

export class ScholarshipBot {
    private data: any;
    
    constructor() {
        this.data = scholarshipData;
    }
    
    private containsKeyword(text: string, keywords: string[]): boolean {
        const lowerText = text.toLowerCase();
        for (const keyword of keywords) {
            if (lowerText.includes(keyword.toLowerCase())) {
                return true;
            }
        }
        return false;
    }
    
    getResponse(userMessage: string): string {
        const msg = userMessage.toLowerCase().trim();
        
        //------------------------this is for to  Skip very short messages--------------------------
        if (msg.length < 3 || msg === 'hy' || msg === 'hi' || msg === 'hello') {
            return this.getHelpResponse();
        }
        
        //--------------------------this is for  COMPLAINT ABOUT TEACHER------------------------------
        if (this.containsKeyword(msg, ['complaint', 'issue', 'problem']) && this.containsKeyword(msg, ['teacher', 'professor', 'faculty'])) {
            return this.getTeacherComplaintResponse();
        }
        
        //---------------------this is for to  COMPLAINT (general)-------------------------
        if (this.containsKeyword(msg, ['complaint', 'issue', 'problem', 'complain'])) {
            return this.getGeneralComplaintResponse();
        }
        
        // --------------------this is for TEACHER------------------------ 
        if (this.containsKeyword(msg, ['teacher', 'professor', 'faculty'])) {
            return "What would you like to know about teachers?\n\n- To file a complaint: type 'complaint about teacher'\n- To check teacher schedule: contact department office\n- Teacher contact info: available on student portal\n\nDo you want to file a complaint?";
        }
        
        // -----------------------this is for SPORTS---------------------
        if (this.containsKeyword(msg, ['sports', 'gym', 'cricket', 'football'])) {
            return this.getSportsResponse();
        }
        
        // -----------------this for FEE--------------------
        if (this.containsKeyword(msg, ['fee', 'fees', 'tuition', 'payment', 'cost'])) {
            if (this.containsKeyword(msg, ['structure', 'per semester', 'program'])) {
                return this.getFeeStructureResponse();
            }
            if (this.containsKeyword(msg, ['payment', 'pay', 'method', 'bank', 'online'])) {
                return this.getFeePaymentResponse();
            }
            if (this.containsKeyword(msg, ['deadline', 'due', 'late'])) {
                return this.getFeeDeadlineResponse();
            }
            if (this.containsKeyword(msg, ['concession', 'waiver', 'discount'])) {
                return this.getFeeConcessionResponse();
            }
            return this.getFeeGeneralResponse();
        }
        
        //------------------this for ADMISSION-----------------------
        if (this.containsKeyword(msg, ['admission', 'apply', 'enroll', 'join university'])) {
            if (this.containsKeyword(msg, ['requirement', 'eligibility', 'gpa', 'marks'])) {
                return this.getAdmissionRequirementsResponse();
            }
            if (this.containsKeyword(msg, ['date', 'deadline', 'when'])) {
                return this.getAdmissionDatesResponse();
            }
            if (this.containsKeyword(msg, ['process', 'how to', 'steps'])) {
                return this.getAdmissionProcessResponse();
            }
            if (this.containsKeyword(msg, ['entry test', 'entrance', 'nts'])) {
                return this.getEntryTestResponse();
            }
            return this.getAdmissionGeneralResponse();
        }
        
        //------------------------this is for  SCHOLARSHIP----------------------------
        if (this.containsKeyword(msg, ['scholarship', 'scholar', 'financial aid', 'fund'])) {
            if (this.containsKeyword(msg, ['deadline', 'due', 'last date'])) {
                return this.getScholarshipDeadlineResponse();
            }
            if (this.containsKeyword(msg, ['criteria', 'eligible', 'gpa', 'requirement'])) {
                return this.getScholarshipCriteriaResponse();
            }
            if (this.containsKeyword(msg, ['apply', 'application', 'how to apply'])) {
                return this.getScholarshipApplyResponse();
            }
            if (this.containsKeyword(msg, ['document', 'upload', 'transcript'])) {
                return this.getScholarshipDocumentsResponse();
            }
            if (this.containsKeyword(msg, ['amount', 'money', 'worth'])) {
                return this.getScholarshipAmountResponse();
            }
            return this.getScholarshipGeneralResponse();
        }
        
        //-------------------------------this is for EXAM--------------------------------
        if (this.containsKeyword(msg, ['exam', 'test', 'midterm', 'final', 'quiz'])) {
            if (this.containsKeyword(msg, ['schedule', 'date', 'when'])) {
                return this.getExamScheduleResponse();
            }
            if (this.containsKeyword(msg, ['rule', 'policy', 'allowed'])) {
                return this.getExamRulesResponse();
            }
            if (this.containsKeyword(msg, ['result', 'marks', 'grade', 'gpa'])) {
                return this.getExamResultResponse();
            }
            return this.getExamGeneralResponse();
        }
        
        //--------------------this for  ATTENDANCE-------------------------
        if (this.containsKeyword(msg, ['attendance', 'absent', 'leave'])) {
            return this.getAttendanceResponse();
        }
        
        //---------------------this for DRESS CODE--------------------------
        if (this.containsKeyword(msg, ['dress code', 'uniform', 'clothing'])) {
            return this.getDressCodeResponse();
        }
        
        //----------------------this for CONTACT----------------------------------
        if (this.containsKeyword(msg, ['contact', 'phone', 'number', 'email', 'helpline'])) {
            return this.getContactResponse();
        }
        
        // HOSTEL
        if (this.containsKeyword(msg, ['hostel', 'accommodation', 'room'])) {
            return this.getHostelResponse();
        }
        
        // LIBRARY
        if (this.containsKeyword(msg, ['library', 'book', 'borrow'])) {
            return this.getLibraryResponse();
        }
        
        // TRANSPORT
        if (this.containsKeyword(msg, ['transport', 'bus', 'van', 'shuttle'])) {
            return this.getTransportResponse();
        }
        
        return this.getHelpResponse();
    }
    
    // ============ RESPONSE METHODS ============
    
    private getHelpResponse(): string {
        return `Hello! I can help you with:

1. FEES - Structure, payment, deadline, concession
2. ADMISSIONS - Requirements, dates, process, entry test
3. SCHOLARSHIPS - Deadlines, criteria, apply, documents
4. EXAMS - Schedule, rules, results
5. COMPLAINTS - Teacher, classroom, hostel, transport
6. POLICIES - Attendance, dress code
7. GENERAL - Sports, hostel, library, transport, contacts

Examples:
- "Fee structure for Computer Science"
- "Complaint about teacher"
- "Admission requirements"
- "Scholarship deadline"
- "Exam schedule"
- "Attendance policy"

What would you like to know?`;
    }
    
    private getTeacherComplaintResponse(): string {
        return `TEACHER COMPLAINT PROCESS

How to file complaint against teacher:

STEP 1: Talk to teacher directly first
STEP 2: If not resolved, contact Department Head
STEP 3: Submit written complaint to Student Affairs Office
STEP 4: Committee investigates (2 weeks)

Valid complaints:
- Unprofessional behavior
- Harassment or discrimination
- Unfair grading
- Not taking classes

Serious cases (harassment):
- Women Safety Committee: 051-1234592 (24/7)
- Email: womensafety@comsats.edu.pk
- Identity kept confidential

Student Affairs Office:
- Phone: 051-1234570
- Location: First Floor, Admin Block`;
    }
    
    private getGeneralComplaintResponse(): string {
        return `HOW TO FILE A COMPLAINT

1. Identify issue type (teacher, classroom, library, hostel, transport)
2. Contact relevant department first
3. Submit written complaint to Student Affairs Office
4. Get complaint number for tracking
5. Resolution within 2 weeks

Complaint Helpline: 051-1234593
Email: complaints@comsats.edu.pk

For teacher complaint, type: "complaint about teacher"`;
    }
    
    private getSportsResponse(): string {
        return `SPORTS FACILITIES

INDOOR: Table Tennis, Badminton, Chess, Carrom
OUTDOOR: Cricket, Football, Basketball, Volleyball, Tennis
GYM: 4:00 PM to 8:00 PM (Free for students)

SPORTS SCHOLARSHIP: Up to 50% fee waiver for national level players

Contact Sports Office: 051-1234567 ext 555
Email: sports@comsats.edu.pk`;
    }
    
    private getFeeStructureResponse(): string {
        return `FEE STRUCTURE (Per Semester)

ENGINEERING (CS, Electrical, Mechanical): Rs. 145,000
COMPUTING (CS, Software, AI): Rs. 135,000
BUSINESS (BBA, Accounting): Rs. 125,000
SCIENCES (Math, Physics, Chemistry): Rs. 105,000
SOCIAL SCIENCES: Rs. 95,000

ONE-TIME FEES: Admission Rs. 25,000, Security Rs. 10,000

ADDITIONAL PER SEMESTER:
Library Rs. 5,000 | Sports Rs. 3,000 | Medical Rs. 2,000 | Exam Rs. 4,000

Contact Fee Office: 051-1234573`;
    }
    
    private getFeePaymentResponse(): string {
        return `FEE PAYMENT METHODS

1. BANK CHALLAN: HBL, UBL, MCB, Allied Bank (2-3 days processing)
2. ONLINE BANKING: HBL, UBL, MCB (24 hours)
3. CREDIT CARD: Visa/MasterCard on portal (instant)
4. EASYPAISA/JAZZCASH: Rs. 50 fee (1 hour)

STEPS:
1. Login to student portal
2. Go to Finance -> Fee Challan
3. Generate challan
4. Make payment
5. Upload proof (if bank challan)

Contact: 051-1234573 for help`;
    }
    
    private getFeeDeadlineResponse(): string {
        return `FEE DEADLINES 2026

FALL SEMESTER:
- Fee issue: September 25
- Deadline: October 10
- Late period: October 11-25

LATE FINES:
- 1-7 days late: Rs. 500/day
- 8-15 days late: Rs. 1,000/day
- After 15 days: Registration blocked

SPRING SEMESTER 2027:
- Deadline: March 5
- Late period: March 6-20

Contact Fee Office for extension: 051-1234573`;
    }
    
    private getFeeConcessionResponse(): string {
        return `FEE CONCESSION OPTIONS

1. NEED-BASED (Up to 50%):
   - Family income below Rs. 50,000/month
   - Maintain 2.5 GPA
   - Apply at Financial Aid Office

2. MERIT-BASED (25-100%):
   - GPA 3.0-3.39: 25%
   - GPA 3.4-3.59: 50%
   - GPA 3.6-3.79: 75%
   - GPA 3.8-4.0: 100%

3. SPORTS (Up to 50%):
   - National or provincial level player

4. SPECIAL QUOTA:
   - Employee children (25%)
   - Orphan students (50%)
   - Differently-abled (30%)

Contact Financial Aid: 051-1234574
Email: financialaid@comsats.edu.pk`;
    }
    
    private getFeeGeneralResponse(): string {
        return `FEE INFORMATION

Ask me about:
- "Fee structure for Computer Science"
- "How to pay fee online"
- "Fee deadline for fall semester"
- "How to apply for fee concession"
- "Fee refund policy"

Fee Office: 051-1234573
Financial Aid: 051-1234574
Email: feeoffice@comsats.edu.pk`;
    }
    
    private getAdmissionRequirementsResponse(): string {
        return `ADMISSION REQUIREMENTS

ELIGIBILITY:
- 60% marks in FA/FSc/ICS/A-Level
- Entry test: 50% minimum
- No third division

DOCUMENTS NEEDED:
- Matric & Intermediate certificates (attested)
- Domicile certificate
- CNIC/B-Form
- Father's CNIC copy
- 4 passport size photos

Contact Admission Office: 051-1234568`;
    }
    
    private getAdmissionDatesResponse(): string {
        return `ADMISSION DATES FALL 2026

Application deadline: September 15, 2026
Entry test: September 20, 2026
Merit list: September 30, 2026
Fee submission: October 10, 2026
Classes start: October 15, 2026

Apply online: admissions.comsats.edu.pk
Contact: 051-1234568`;
    }
    
    private getAdmissionProcessResponse(): string {
        return `ADMISSION PROCESS

1. Apply online at admissions.comsats.edu.pk
2. Pay Rs. 1,500 application fee
3. Download roll number slip
4. Appear for entry test
5. Check merit list
6. Submit fee if selected

For help: Admission Office, 051-1234568`;
    }
    
    private getEntryTestResponse(): string {
        return `ENTRY TEST INFORMATION

Date: September 20, 2026
Time: 10:00 AM to 12:00 PM
Venue: COMSATS Campus

SYLLABUS:
- English: 30%
- Mathematics: 30%
- General Knowledge: 20%
- Analytical Reasoning: 20%

Passing marks: 50%
Bring CNIC and roll number slip

Contact: 051-1234568`;
    }
    
    private getAdmissionGeneralResponse(): string {
        return `ADMISSION INFORMATION

Ask me about:
- "Admission requirements"
- "Admission dates"
- "Admission process"
- "Entry test"
- "Merit list"

Admission Office: 051-1234568
Email: admissions@comsats.edu.pk
Website: admissions.comsats.edu.pk`;
    }
    
    private getScholarshipDeadlineResponse(): string {
        return `SCHOLARSHIP DEADLINES 2026

Merit Scholarship: May 30, 2026
Need-Based Scholarship: June 15, 2026
Sports Scholarship: April 20, 2026

Apply on student portal before deadline.
Contact: 051-1234571`;
    }
    
    private getScholarshipCriteriaResponse(): string {
        return `SCHOLARSHIP ELIGIBILITY

MERIT: 3.5 GPA, 80% attendance
NEED-BASED: Family income below $50,000, 2.5 GPA
SPORTS: University team member, 70% attendance

Contact Scholarship Office: 051-1234571`;
    }
    
    private getScholarshipApplyResponse(): string {
        return `HOW TO APPLY FOR SCHOLARSHIP

1. Login to student portal
2. Go to Scholarships section
3. Select scholarship type
4. Fill application form
5. Upload documents
6. Submit before deadline

Results in 2 weeks.
Contact: 051-1234571`;
    }
    
    private getScholarshipDocumentsResponse(): string {
        return `SCHOLARSHIP DOCUMENTS

COMMON:
- Recent transcript
- CNIC/B-Form copy
- Passport size photo
- Admission letter

ADDITIONAL:
- Income proof (Need-based)
- Sports certificate (Sports)
- Recommendation letters

Upload PDF/JPG (max 5MB)`;
    }
    
    private getScholarshipAmountResponse(): string {
        return `SCHOLARSHIP AMOUNTS

Merit Scholarship: $5,000 per semester
Need-Based Scholarship: $3,000 per semester
Sports Scholarship: $2,000 per semester

Contact: scholarship@comsats.edu.pk`;
    }
    
    private getScholarshipGeneralResponse(): string {
        return `SCHOLARSHIP INFORMATION

Ask me about:
- "Scholarship deadline"
- "Scholarship criteria"
- "How to apply for scholarship"
- "Scholarship documents"
- "Scholarship amount"

Scholarship Office: 051-1234571
Email: scholarship@comsats.edu.pk`;
    }
    
    private getExamScheduleResponse(): string {
        return `EXAM SCHEDULE 2026

MIDTERM EXAMS: October 15-25, 2026
FINAL EXAMS: December 10-22, 2026

Detailed timetable on student portal 2 weeks before exams.
Contact Exam Office: 051-1234572`;
    }
    
    private getExamRulesResponse(): string {
        return `EXAM RULES

- Bring original student ID card
- Reach exam hall 15 minutes before
- No mobile phones or smartwatches
- No calculators (unless allowed)
- No talking or cheating

Violation = marks deduction or cancellation`;
    }
    
    private getExamResultResponse(): string {
        return `EXAM RESULTS

Midterm results: Within 2 weeks
Final results: Within 3 weeks

Check on student portal -> Results section

GRADING:
A=4.0, B=3.0, C=2.0, D=1.0, F=0.0

Contact Exam Office: 051-1234572`;
    }
    
    private getExamGeneralResponse(): string {
        return `EXAM INFORMATION

Ask me about:
- "Exam schedule"
- "Exam rules"
- "Exam results"
- "Passing criteria"

Exam Office: 051-1234572
Email: exams@comsats.edu.pk`;
    }
    
    private getAttendanceResponse(): string {
        return `ATTENDANCE POLICY

- Minimum 75% required per course
- Below 60%: Dropped from course
- 60-74%: Rs. 2,000 fine + can appear in exam

MEDICAL LEAVE: Submit doctor certificate within 3 days

Check attendance on student portal -> Attendance section`;
    }
    
    private getDressCodeResponse(): string {
        return `DRESS CODE

MALE: Collared shirt, clean shaven, closed shoes
FEMALE: Modest clothing, dupatta compulsory
ALL: ID card visible, no shorts/sleeveless, no slippers

Violation = warning or fine`;
    }
    
    private getContactResponse(): string {
        return `CONTACT DIRECTORY

MAIN CAMPUS: 051-1234567
ADMISSION: 051-1234568
STUDENT AFFAIRS: 051-1234570
SCHOLARSHIP: 051-1234571
EXAM OFFICE: 051-1234572
FEE OFFICE: 051-1234573
FINANCIAL AID: 051-1234574
SPORTS OFFICE: 051-1234567 ext 555
HOSTEL OFFICE: 051-1234576
TRANSPORT OFFICE: 051-1234577
LIBRARY: 051-1234578

EMERGENCY:
- Campus Security: 1122 (24/7)
- Women Safety: 051-1234592

Office Hours: Monday-Friday, 9:00 AM to 5:00 PM`;
    }
    
    private getHostelResponse(): string {
        return `HOSTEL INFORMATION

FEES (per semester):
- Single: Rs. 25,000
- Double: Rs. 18,000
- Triple: Rs. 15,000

MESS FEE: Rs. 28,000 per semester (includes 3 meals)

FACILITIES: 24/7 electricity/water, WiFi, security, laundry, common room

HOW TO APPLY: Online on student portal (limited seats)

Hostel Office: 051-1234576
Warden (Boys): 0300-1234567
Warden (Girls): 0300-1234568`;
    }
    
    private getLibraryResponse(): string {
        return `LIBRARY INFORMATION

TIMING:
- Mon-Thu: 8:00 AM to 8:00 PM
- Friday: 8:00 AM to 12:00 PM, 2:30 PM to 8:00 PM
- Saturday: 9:00 AM to 5:00 PM

BORROW: 5 books for 2 weeks
LATE FINE: Rs. 10/day per book

DIGITAL RESOURCES: HEC Digital Library, IEEE, ScienceDirect

Contact: 051-1234578`;
    }
    
    private getTransportResponse(): string {
        return `TRANSPORT INFORMATION

ROUTES: Rawalpindi, Islamabad, Bahria Town, DHA, Gulberg
FEE: Rs. 15,000 per semester
TIMING: Pickup 7:00 AM, Drop 5:00 PM

HOW TO APPLY: Pay fee at transport office, get bus pass

Transport Office: 051-1234577
Late bus contact: Route-specific numbers available at transport office`;
    }
    
    private getDefaultResponse(): string {
        return this.getHelpResponse();
    }
}