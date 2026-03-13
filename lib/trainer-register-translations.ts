// lib/trainer-register-translations.ts
// Import this in app/trainers/register/page.tsx and add the lang toggle

export const TRAINER_T = {
  en: {
    pageTitle: "Register as a Trainer",
    langToggle: ["English", "हिंदी"],
    steps: ["You", "Experience", "Vehicle", "Packages", "Documents"],
    stepSubtitles: [
      "Tell us about yourself",
      "Your driving expertise",
      "Your training vehicle",
      "Set your pricing",
      "Verify your identity",
    ],

    // Step 1 — Personal
    fullName: "Full Name *",
    namePlaceholder: "Rajesh Kumar",
    mobile: "Mobile Number *",
    mobilePlaceholder: "9876543210",
    email: "Email Address",
    emailPlaceholder: "you@gmail.com",
    city: "City *",
    searchCity: "Search city...",
    pincode: "Your Pincode *",
    pincodePlaceholder: "110001",
    serviceArea: "Areas You Cover",
    serviceAreaPlaceholder: "e.g. Dwarka, Janakpuri, Uttam Nagar",
    languages: "Languages You Speak *",
    trainerType: "Trainer Type *",
    trainerTypes: { INDEPENDENT: "Independent Trainer", DRIVING_SCHOOL: "Driving School" },
    bio: "About You",
    bioPlaceholder: "Tell students about your teaching style, experience, areas you cover...",

    // Step 2 — Experience
    yearsExp: "Years of Experience *",
    licenseNo: "Driving Licence Number *",
    licensePlaceholder: "DL01XXXXXXXXXX",
    vehicleTypes: "Vehicle Types You Train *",
    vehicleTypeLabels: { CAR: "🚗 Car", BIKE_GEARED: "🏍️ Bike (Geared)", BIKE_NON_GEARED: "🛵 Scooter (Non-geared)", BIKE: "🏍️ Bike" },

    // Step 3 — Vehicle
    vehicleNumber: "Vehicle Registration Number *",
    vehicleNumberPlaceholder: "DL01AB1234",
    vehicleType: "Vehicle Type *",
    dualControl: "This vehicle has a dual-control brake",
    dualControlDesc: "Safety brake on trainer's side",
    insured: "Vehicle is insured",
    insuredDesc: "Valid insurance for training use",

    // Step 4 — Packages
    packagesTitle: "Your Training Packages",
    packagesDesc: "Add at least one package. Students will see these on your profile.",
    addPackage: "+ Add Package",
    packageName: "Package Name *",
    packageNamePlaceholder: "e.g. Basic Car Training",
    packagePrice: "Price (₹) *",
    packageDays: "Days",
    packageSession: "Session Length",
    packageSessionPlaceholder: "e.g. 1 hour",
    packageIncludes: "What's Included",
    packageIncludesPlaceholder: "e.g. Pickup, RTO prep, certificate",
    removePackage: "Remove",

    // Step 5 — Documents
    aadhar: "Aadhaar Number *",
    aadharPlaceholder: "XXXX XXXX XXXX",
    aadharNote: "Stored securely with AES-256 encryption. Not shared with students.",
    uploadDL: "Upload Driving Licence",
    uploadPhoto: "Upload Your Photo",
    uploadVehicleRC: "Upload Vehicle RC",

    // Buttons
    next: "Continue →",
    back: "← Back",
    submit: "Submit Application →",
    submitting: "Submitting...",

    // Success
    successTitle: "Application Submitted! 🎉",
    successMsg: "Our team will review your profile within 24–48 hours and call you on",
    successNext: "What happens next:",
    successSteps: [
      "📋 We verify your DL and Aadhaar",
      "📞 A call to confirm your packages and availability",
      "✅ Profile goes live — students start booking",
      "💰 Payouts every week directly to your bank",
    ],
    goHome: "Back to Home",

    // Errors
    errors: {
      name: "Enter your full name",
      mobile: "Enter a valid 10-digit mobile number",
      city: "Select your city",
      pincode: "Enter your 6-digit pincode",
      languages: "Select at least one language",
      trainerType: "Select trainer type",
      experience: "Enter your years of experience",
      licenseNo: "Enter your driving licence number",
      vehicleTypes: "Select at least one vehicle type",
      vehicleNumber: "Enter your vehicle number",
      vehicleType: "Select vehicle type",
      packages: "Add at least one package",
      packageName: "Package name is required",
      packagePrice: "Enter a valid price",
      aadhar: "Enter your 12-digit Aadhaar number",
    },
  },
  hi: {
    pageTitle: "ट्रेनर के रूप में रजिस्टर करें",
    langToggle: ["English", "हिंदी"],
    steps: ["आप", "अनुभव", "वाहन", "पैकेज", "दस्तावेज़"],
    stepSubtitles: [
      "अपने बारे में बताएं",
      "आपकी ड्राइविंग विशेषज्ञता",
      "आपका प्रशिक्षण वाहन",
      "अपनी कीमत तय करें",
      "अपनी पहचान सत्यापित करें",
    ],

    // Step 1
    fullName: "पूरा नाम *",
    namePlaceholder: "राजेश कुमार",
    mobile: "मोबाइल नंबर *",
    mobilePlaceholder: "9876543210",
    email: "ईमेल पता",
    emailPlaceholder: "you@gmail.com",
    city: "शहर *",
    searchCity: "शहर खोजें...",
    pincode: "आपका पिनकोड *",
    pincodePlaceholder: "110001",
    serviceArea: "आप किन क्षेत्रों में पढ़ाते हैं",
    serviceAreaPlaceholder: "जैसे द्वारका, जनकपुरी, उत्तम नगर",
    languages: "आप कौन सी भाषाएं बोलते हैं *",
    trainerType: "ट्रेनर प्रकार *",
    trainerTypes: { INDEPENDENT: "स्वतंत्र ट्रेनर", DRIVING_SCHOOL: "ड्राइविंग स्कूल" },
    bio: "अपने बारे में",
    bioPlaceholder: "छात्रों को अपनी शिक्षण शैली, अनुभव, जिन क्षेत्रों में पढ़ाते हैं उसके बारे में बताएं...",

    // Step 2
    yearsExp: "अनुभव के वर्ष *",
    licenseNo: "ड्राइविंग लाइसेंस नंबर *",
    licensePlaceholder: "DL01XXXXXXXXXX",
    vehicleTypes: "आप किस वाहन की ट्रेनिंग देते हैं *",
    vehicleTypeLabels: { CAR: "🚗 कार", BIKE_GEARED: "🏍️ बाइक (गियर)", BIKE_NON_GEARED: "🛵 स्कूटर (नॉन-गियर)", BIKE: "🏍️ बाइक" },

    // Step 3
    vehicleNumber: "वाहन पंजीकरण नंबर *",
    vehicleNumberPlaceholder: "DL01AB1234",
    vehicleType: "वाहन प्रकार *",
    dualControl: "इस वाहन में दोहरा नियंत्रण ब्रेक है",
    dualControlDesc: "ट्रेनर की तरफ सेफ्टी ब्रेक",
    insured: "वाहन का बीमा है",
    insuredDesc: "प्रशिक्षण उपयोग के लिए वैध बीमा",

    // Step 4
    packagesTitle: "आपके प्रशिक्षण पैकेज",
    packagesDesc: "कम से कम एक पैकेज जोड़ें। छात्र आपकी प्रोफ़ाइल पर यही देखेंगे।",
    addPackage: "+ पैकेज जोड़ें",
    packageName: "पैकेज का नाम *",
    packageNamePlaceholder: "जैसे बेसिक कार ट्रेनिंग",
    packagePrice: "कीमत (₹) *",
    packageDays: "दिन",
    packageSession: "सत्र की अवधि",
    packageSessionPlaceholder: "जैसे 1 घंटा",
    packageIncludes: "क्या शामिल है",
    packageIncludesPlaceholder: "जैसे पिकअप, RTO तैयारी, सर्टिफिकेट",
    removePackage: "हटाएं",

    // Step 5
    aadhar: "आधार नंबर *",
    aadharPlaceholder: "XXXX XXXX XXXX",
    aadharNote: "AES-256 एन्क्रिप्शन से सुरक्षित रूप से संग्रहीत। छात्रों के साथ साझा नहीं किया जाता।",
    uploadDL: "ड्राइविंग लाइसेंस अपलोड करें",
    uploadPhoto: "अपनी फ़ोटो अपलोड करें",
    uploadVehicleRC: "वाहन RC अपलोड करें",

    // Buttons
    next: "आगे बढ़ें →",
    back: "← वापस",
    submit: "आवेदन सबमिट करें →",
    submitting: "सबमिट हो रहा है...",

    // Success
    successTitle: "आवेदन सबमिट हुआ! 🎉",
    successMsg: "हमारी टीम 24–48 घंटों में आपकी प्रोफ़ाइल की समीक्षा करेगी और आपको कॉल करेगी",
    successNext: "आगे क्या होगा:",
    successSteps: [
      "📋 हम आपका DL और आधार सत्यापित करेंगे",
      "📞 आपके पैकेज और उपलब्धता की पुष्टि के लिए कॉल",
      "✅ प्रोफ़ाइल लाइव होगी — छात्र बुकिंग शुरू करेंगे",
      "💰 हर हफ्ते सीधे आपके बैंक में भुगतान",
    ],
    goHome: "होम पर वापस जाएं",

    // Errors
    errors: {
      name: "अपना पूरा नाम दर्ज करें",
      mobile: "वैध 10 अंकों का मोबाइल नंबर दर्ज करें",
      city: "अपना शहर चुनें",
      pincode: "6 अंकों का पिनकोड दर्ज करें",
      languages: "कम से कम एक भाषा चुनें",
      trainerType: "ट्रेनर प्रकार चुनें",
      experience: "अनुभव के वर्ष दर्ज करें",
      licenseNo: "अपना ड्राइविंग लाइसेंस नंबर दर्ज करें",
      vehicleTypes: "कम से कम एक वाहन प्रकार चुनें",
      vehicleNumber: "अपना वाहन नंबर दर्ज करें",
      vehicleType: "वाहन प्रकार चुनें",
      packages: "कम से कम एक पैकेज जोड़ें",
      packageName: "पैकेज का नाम आवश्यक है",
      packagePrice: "वैध कीमत दर्ज करें",
      aadhar: "12 अंकों का आधार नंबर दर्ज करें",
    },
  },
};

export type Lang = "en" | "hi";