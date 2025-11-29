// lib/form-templates.ts
export const FORM_TEMPLATES = {
  basic: {
    name: "Basic Form",
    description: "Simple application with contact info and documents",
    fields: [
      { 
        type: "text", 
        label: "Full Name", 
        name: "full_name", 
        required: true,
        placeholder: "Enter your full name"
      },
      { 
        type: "email", 
        label: "Email Address", 
        name: "email", 
        required: true,
        placeholder: "your.email@university.edu"
      },
      { 
        type: "text", 
        label: "Phone Number", 
        name: "phone", 
        required: true,
        placeholder: "+1234567890"
      },
      { 
        type: "file", 
        label: "CV/Resume", 
        name: "resume", 
        required: true 
      },
      { 
        type: "file", 
        label: "ID Proof", 
        name: "id_proof", 
        required: true 
      }
    ]
  },
  academic: {
    name: "Academic Form", 
    description: "Academic performance and achievements",
    fields: [
      { 
        type: "number", 
        label: "Current CGPA", 
        name: "cgpa", 
        required: true, 
        validation: { min: 0, max: 4 },
        placeholder: "3.5"
      },
      { 
        type: "file", 
        label: "Academic Transcripts", 
        name: "transcripts", 
        required: true 
      },
      { 
        type: "text", 
        label: "Department/Faculty", 
        name: "department", 
        required: true,
        placeholder: "Computer Science"
      },
      { 
        type: "number", 
        label: "Current Semester/Year", 
        name: "current_semester", 
        required: true,
        placeholder: "6"
      },
      { 
        type: "textarea", 
        label: "Academic Achievements", 
        name: "achievements", 
        required: false,
        placeholder: "List your academic awards, competitions, etc."
      }
    ]
  },
  research: {
    name: "Research Form",
    description: "Research background and publications",
    fields: [
      { 
        type: "text", 
        label: "Research Topic", 
        name: "research_topic", 
        required: true,
        placeholder: "Your research area"
      },
      { 
        type: "text", 
        label: "Supervisor Name", 
        name: "supervisor", 
        required: true,
        placeholder: "Dr. Professor Name"
      },
      { 
        type: "textarea", 
        label: "Research Proposal", 
        name: "research_proposal", 
        required: true,
        placeholder: "Describe your research proposal (min. 500 words)"
      },
      { 
        type: "file", 
        label: "Publications (if any)", 
        name: "publications", 
        required: false 
      },
      { 
        type: "textarea", 
        label: "Conference Presentations", 
        name: "conferences", 
        required: false,
        placeholder: "List conferences where you presented"
      }
    ]
  },
  financial: {
    name: "Financial Aid Form",
    description: "Financial information and need-based requirements",
    fields: [
      { 
        type: "number", 
        label: "Annual Family Income", 
        name: "family_income", 
        required: true,
        placeholder: "50000"
      },
      { 
        type: "file", 
        label: "Income Proof Documents", 
        name: "income_proof", 
        required: true 
      },
      { 
        type: "number", 
        label: "Number of Family Members", 
        name: "family_members", 
        required: true,
        placeholder: "4"
      },
      { 
        type: "textarea", 
        label: "Financial Need Statement", 
        name: "financial_statement", 
        required: true,
        placeholder: "Explain your financial situation and need for scholarship"
      },
      { 
        type: "file", 
        label: "Bank Statements", 
        name: "bank_statements", 
        required: false 
      }
    ]
  },
  detailed: {
    name: "Detailed Application Form",
    description: "Comprehensive scholarship application",
    fields: [
      { 
        type: "text", 
        label: "Full Name", 
        name: "full_name", 
        required: true 
      },
      { 
        type: "email", 
        label: "Email", 
        name: "email", 
        required: true 
      },
      { 
        type: "number", 
        label: "CGPA", 
        name: "cgpa", 
        required: true 
      },
      { 
        type: "text", 
        label: "Department", 
        name: "department", 
        required: true 
      },
      { 
        type: "textarea", 
        label: "Personal Statement", 
        name: "personal_statement", 
        required: true,
        placeholder: "Why do you deserve this scholarship?"
      },
      { 
        type: "textarea", 
        label: "Career Goals", 
        name: "career_goals", 
        required: true,
        placeholder: "What are your future career plans?"
      },
      { 
        type: "file", 
        label: "Transcripts", 
        name: "transcripts", 
        required: true 
      },
      { 
        type: "file", 
        label: "Recommendation Letters", 
        name: "recommendations", 
        required: true 
      }
    ]
  }
};

export const STUDENT_TYPE_FIELDS = {
  undergraduate: [
    { 
      type: "number", 
      label: "Current Semester", 
      name: "current_semester", 
      required: true, 
      validation: { min: 1, max: 8 },
      placeholder: "6"
    },
    { 
      type: "text", 
      label: "Faculty", 
      name: "faculty", 
      required: true,
      placeholder: "Engineering, Medicine, Arts, etc."
    },
    { 
      type: "text", 
      label: "Roll Number", 
      name: "roll_number", 
      required: true,
      placeholder: "2023-CS-001"
    }
  ],
  graduate: [
    { 
      type: "text", 
      label: "Research Area", 
      name: "research_area", 
      required: true,
      placeholder: "Machine Learning, Biotechnology, etc."
    },
    { 
      type: "text", 
      label: "Thesis Topic", 
      name: "thesis_topic", 
      required: false,
      placeholder: "Your thesis/dissertation topic"
    },
    { 
      type: "number", 
      label: "Years Completed in Program", 
      name: "years_completed", 
      required: true,
      placeholder: "2"
    },
    { 
      type: "text", 
      label: "Program Type", 
      name: "program_type", 
      required: true,
      placeholder: "Masters, PhD, etc."
    }
  ]
};

export const TEMPLATE_OPTIONS = [
  { value: "basic", label: "📋 Basic Form", description: "Contact info + basic documents" },
  { value: "academic", label: "🎓 Academic Form", description: "Grades, transcripts, achievements" },
  { value: "research", label: "🔬 Research Form", description: "Research topics, publications, proposals" },
  { value: "financial", label: "💰 Financial Aid Form", description: "Income, financial documents, need statement" },
  { value: "detailed", label: "📄 Detailed Application", description: "Comprehensive application with essays" },
  { value: "custom", label: "⚙️ Custom Form", description: "Build your own custom form" }
];