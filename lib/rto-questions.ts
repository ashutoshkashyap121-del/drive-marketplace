export type Question = {
  id: number;
  topic: Topic;
  question: string;
  options: string[];
  correct: number; // index of correct answer
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
  image?: string; // emoji to represent sign
};

export type Topic =
  | "traffic_signs"
  | "road_rules"
  | "speed_limits"
  | "documents"
  | "drunk_driving"
  | "highway_rules";

export const topicMeta: Record<Topic, { label: string; icon: string; color: string; description: string }> = {
  traffic_signs: { label: "Traffic Signs & Signals", icon: "🚦", color: "#e85d04", description: "Mandatory, cautionary, and informatory signs" },
  road_rules: { label: "Road Rules & Lane Discipline", icon: "🛣️", color: "#023e8a", description: "Right of way, lane usage, overtaking" },
  speed_limits: { label: "Speed Limits & Fines", icon: "⚡", color: "#6d28d9", description: "Urban, highway, and zone-specific limits" },
  documents: { label: "Documents & Licence Types", icon: "🪪", color: "#0d9e55", description: "DL, RC, insurance, PUC requirements" },
  drunk_driving: { label: "Drunk Driving & Penalties", icon: "🚫", color: "#dc2626", description: "BAC limits, fines, and consequences" },
  highway_rules: { label: "Highway & Expressway Rules", icon: "🛤️", color: "#b45309", description: "Expressway regulations and safety" },
};

export const questions: Question[] = [
  // ─── TRAFFIC SIGNS ───
  {
    id: 1, topic: "traffic_signs", difficulty: "easy",
    question: "What does a red circle with a white horizontal bar in the centre mean?",
    image: "⛔",
    options: ["No entry", "Stop", "No parking", "No overtaking"],
    correct: 0,
    explanation: "The red circle with a white bar is the 'No Entry' sign. It means vehicles are not allowed to enter the road or area from that direction.",
  },
  {
    id: 2, topic: "traffic_signs", difficulty: "easy",
    question: "What shape are cautionary (warning) signs in India?",
    options: ["Red circle", "Blue rectangle", "Red triangle", "Octagon"],
    correct: 2,
    explanation: "Cautionary signs are red equilateral triangles (pointing upwards) with a white background. They warn drivers of hazards ahead.",
  },
  {
    id: 3, topic: "traffic_signs", difficulty: "easy",
    question: "A red octagonal sign with the word STOP means:",
    image: "🛑",
    options: ["Slow down and proceed", "Give way to traffic", "Come to a complete stop and give way", "Parking prohibited"],
    correct: 2,
    explanation: "A STOP sign requires you to come to a complete stop, check for traffic from all directions, and only proceed when it is safe.",
  },
  {
    id: 4, topic: "traffic_signs", difficulty: "medium",
    question: "A yellow diamond-shaped sign indicates:",
    options: ["Road work ahead", "School zone", "Right of way road", "Speed bump ahead"],
    correct: 2,
    explanation: "In India, yellow diamond signs are used to show that you are on a priority (right of way) road and other roads must yield to you.",
  },
  {
    id: 5, topic: "traffic_signs", difficulty: "easy",
    question: "What colour are informatory (informational) signs in India?",
    options: ["Red and white", "Yellow and black", "Blue and white", "Green and white"],
    correct: 2,
    explanation: "Informatory signs are blue rectangles with white text or symbols. They provide useful information like hospital, parking, petrol pump locations.",
  },
  {
    id: 6, topic: "traffic_signs", difficulty: "medium",
    question: "A sign showing a red circle with the number 60 means:",
    options: ["Minimum speed 60 km/h", "Maximum speed 60 km/h", "Distance to next town is 60 km", "Speed limit ends at 60"],
    correct: 1,
    explanation: "A red circle with a number is a speed limit sign — it indicates the maximum permitted speed in km/h. You must not exceed this speed.",
  },
  {
    id: 7, topic: "traffic_signs", difficulty: "medium",
    question: "What does a pedestrian crossing sign (zebra crossing) look like?",
    options: ["Blue rectangle with walking figure", "Red triangle with walking figure", "White diamond with walking figure", "Yellow background with two walking figures"],
    correct: 1,
    explanation: "The pedestrian crossing cautionary sign is a red equilateral triangle with a white background showing a walking figure. It warns you that pedestrians may be crossing ahead.",
  },
  {
    id: 8, topic: "traffic_signs", difficulty: "hard",
    question: "A flashing amber signal at a junction means:",
    options: ["Stop and do not proceed", "Proceed with caution", "Give way to all traffic", "Traffic signals are not working — stop and wait"],
    correct: 1,
    explanation: "A flashing amber light means 'proceed with caution.' It is used at times of low traffic (e.g., late night) or when the full signal cycle is not running.",
  },
  {
    id: 9, topic: "traffic_signs", difficulty: "easy",
    question: "The 'Give Way' sign in India is:",
    options: ["Red octagon", "Inverted red triangle", "Blue circle", "Yellow diamond"],
    correct: 1,
    explanation: "The Give Way sign is an inverted (pointing downward) red triangle. It means you must give way to cross-traffic before proceeding.",
  },
  {
    id: 10, topic: "traffic_signs", difficulty: "medium",
    question: "A circular blue sign with a white arrow pointing right means:",
    options: ["No right turn", "Mandatory turn right", "Road curves right", "Right lane closed"],
    correct: 1,
    explanation: "A blue circle with a white arrow is a mandatory direction sign. It means you MUST turn/go in the direction shown — turning left or going straight is not permitted.",
  },

  // ─── ROAD RULES ───
  {
    id: 11, topic: "road_rules", difficulty: "easy",
    question: "At an unmarked intersection with no signals, which vehicle has right of way?",
    options: ["The larger vehicle", "The vehicle coming from the right", "The vehicle going straight", "The first vehicle to arrive"],
    correct: 1,
    explanation: "At an unmarked intersection, the vehicle approaching from the right has priority (right-of-way rule). Give way to traffic approaching from your right.",
  },
  {
    id: 12, topic: "road_rules", difficulty: "easy",
    question: "On a two-lane road, you should drive in:",
    options: ["The right lane at all times", "The left lane, keeping right for overtaking only", "The centre of the road", "Any lane based on preference"],
    correct: 1,
    explanation: "In India (left-hand traffic), you should keep to the left lane for normal driving. The right lane is for overtaking only — return to left after overtaking.",
  },
  {
    id: 13, topic: "road_rules", difficulty: "medium",
    question: "When an ambulance with flashing lights approaches from behind, you should:",
    options: ["Speed up to get out of the way", "Continue at normal speed", "Move to the left and slow down or stop", "Flash your headlights and continue"],
    correct: 2,
    explanation: "When an emergency vehicle (ambulance, fire truck, police) approaches with flashing lights/siren, you must immediately move to the leftmost lane and slow down or stop to let it pass.",
  },
  {
    id: 14, topic: "road_rules", difficulty: "medium",
    question: "Overtaking is NOT permitted when:",
    options: ["The road is wide", "You are on a straight section", "Approaching a bend or crest of a hill", "The road is clear ahead"],
    correct: 2,
    explanation: "Overtaking near bends, hill crests, intersections, pedestrian crossings, or where there is a solid centre line is strictly prohibited as you cannot see oncoming traffic.",
  },
  {
    id: 15, topic: "road_rules", difficulty: "easy",
    question: "When must you NOT use your horn?",
    options: ["When overtaking", "In silence zones (hospitals, schools)", "When approaching a junction", "When a pedestrian is ahead"],
    correct: 1,
    explanation: "Using a horn near hospitals, educational institutions, courts, and residential areas at night is prohibited. These are 'silence zones' marked by signs.",
  },
  {
    id: 16, topic: "road_rules", difficulty: "medium",
    question: "Which side should you use to overtake a vehicle in India?",
    options: ["Either side is permitted", "The left side", "The right side", "Depends on the road width"],
    correct: 2,
    explanation: "In India, overtaking is done from the right side. You may pass on the left only if the driver in front signals a right turn (and you have a clear lane on the left).",
  },
  {
    id: 17, topic: "road_rules", difficulty: "medium",
    question: "At a pedestrian zebra crossing with no traffic signal, you must:",
    options: ["Maintain speed and pass if pedestrian is on footpath", "Slow down and be ready to stop if pedestrian is crossing", "Stop only if pedestrian makes eye contact", "Honk to warn pedestrians and continue"],
    correct: 1,
    explanation: "At a zebra crossing, once a pedestrian steps onto the crossing, you MUST stop and give way. Failure to do so attracts a fine of ₹5,000–10,000.",
  },
  {
    id: 18, topic: "road_rules", difficulty: "hard",
    question: "What does a solid white line in the centre of the road mean?",
    options: ["You may cross it to overtake when safe", "Do not cross — overtaking prohibited", "Lane marking only — no restriction", "Road is narrowing ahead"],
    correct: 1,
    explanation: "A solid white or yellow centre line means you must NOT cross it for overtaking. A broken line means overtaking may be permitted when safe.",
  },
  {
    id: 19, topic: "road_rules", difficulty: "easy",
    question: "When parking, you should leave your wheels:",
    options: ["Turned towards traffic", "Parallel to the kerb", "At an angle away from the kerb", "On the footpath for convenience"],
    correct: 1,
    explanation: "When parking, the vehicle should be parked parallel to and close to the kerb (edge of road), facing in the direction of traffic flow.",
  },
  {
    id: 20, topic: "road_rules", difficulty: "medium",
    question: "Using a mobile phone while driving (without hands-free) is:",
    options: ["Allowed in slow traffic", "Allowed if just checking a message", "Allowed only for navigation", "Prohibited at all times while vehicle is in motion"],
    correct: 3,
    explanation: "Using a handheld phone while driving is prohibited under the Motor Vehicles Act. Fine: ₹1,000–5,000. Using a hands-free device is permitted.",
  },

  // ─── SPEED LIMITS ───
  {
    id: 21, topic: "speed_limits", difficulty: "easy",
    question: "The maximum speed limit for a car on an urban road in India is:",
    options: ["40 km/h", "50 km/h", "60 km/h", "70 km/h"],
    correct: 1,
    explanation: "The standard maximum speed limit for cars on urban/city roads in India is 50 km/h. Motorcycles are limited to 40 km/h on the same roads.",
  },
  {
    id: 22, topic: "speed_limits", difficulty: "medium",
    question: "What is the maximum speed for a car on a National Highway in India?",
    options: ["80 km/h", "100 km/h", "110 km/h", "120 km/h"],
    correct: 3,
    explanation: "Cars (M1 category) are permitted up to 120 km/h on National Highways. However, always comply with any posted lower speed limit signs.",
  },
  {
    id: 23, topic: "speed_limits", difficulty: "easy",
    question: "What is the speed limit near a school or hospital in India?",
    options: ["15 km/h", "25 km/h", "30 km/h", "40 km/h"],
    correct: 1,
    explanation: "Speed limit in school and hospital zones is 25 km/h. These are marked with signage and sometimes have rumble strips or speed humps.",
  },
  {
    id: 24, topic: "speed_limits", difficulty: "medium",
    question: "The penalty for exceeding the speed limit for the first time is:",
    options: ["₹500", "₹1,000–₹2,000", "₹5,000", "₹10,000"],
    correct: 1,
    explanation: "The first-offence penalty for speeding is ₹1,000–₹2,000. Repeat offences within a year attract ₹2,000–₹4,000 and possible suspension.",
  },
  {
    id: 25, topic: "speed_limits", difficulty: "medium",
    question: "On a State Highway, the maximum speed limit for motorcycles is:",
    options: ["60 km/h", "70 km/h", "80 km/h", "100 km/h"],
    correct: 2,
    explanation: "On State Highways, motorcycles (L category) are limited to 80 km/h. Cars and SUVs are limited to 100 km/h on State Highways.",
  },
  {
    id: 26, topic: "speed_limits", difficulty: "hard",
    question: "What is the maximum speed limit for heavy trucks on a National Highway?",
    options: ["60 km/h", "80 km/h", "100 km/h", "120 km/h"],
    correct: 1,
    explanation: "Heavy trucks and buses (M3, N3 category vehicles) are limited to 80 km/h on National Highways, compared to 120 km/h for cars.",
  },
  {
    id: 27, topic: "speed_limits", difficulty: "medium",
    question: "Under adverse weather conditions (heavy rain, fog), you should:",
    options: ["Maintain normal speed to get through quickly", "Reduce speed by at least 30–40%", "Use hazard lights and continue at normal speed", "Stop completely until conditions improve"],
    correct: 1,
    explanation: "In adverse weather, braking distances increase significantly. You should reduce speed by 30–40%, increase following distance, and switch on headlights.",
  },
  {
    id: 28, topic: "speed_limits", difficulty: "easy",
    question: "What is the maximum speed for cars on expressways in India?",
    options: ["100 km/h", "110 km/h", "120 km/h", "130 km/h"],
    correct: 2,
    explanation: "Cars are permitted up to 120 km/h on expressways. However, individual expressways may have their own lower limits — always follow posted signs.",
  },

  // ─── DOCUMENTS ───
  {
    id: 29, topic: "documents", difficulty: "easy",
    question: "Which documents must a driver carry at all times while driving?",
    options: ["Only driving licence", "DL, RC, Insurance, PUC certificate", "DL and PAN card", "RC and Aadhaar card"],
    correct: 1,
    explanation: "You must carry four documents while driving: Driving Licence, Registration Certificate (RC), valid Insurance Certificate, and a valid PUC (Pollution Under Control) certificate.",
  },
  {
    id: 30, topic: "documents", difficulty: "medium",
    question: "Is a digital driving licence stored in DigiLocker or mParivahan valid for traffic police checks?",
    options: ["No, only original physical DL is valid", "Yes, digital copies are legally valid since 2018", "Only for two-wheelers", "Only in cities with e-challan systems"],
    correct: 1,
    explanation: "As per Ministry of Road Transport circular (2018), digital documents stored in DigiLocker or mParivahan are legally valid and must be accepted by traffic police as equivalent to originals.",
  },
  {
    id: 31, topic: "documents", difficulty: "easy",
    question: "What is the penalty for driving without a valid driving licence?",
    options: ["₹500", "₹1,000", "₹5,000", "₹10,000"],
    correct: 2,
    explanation: "Driving without a valid licence is penalized with a fine of ₹5,000 under the amended Motor Vehicles Act 2019.",
  },
  {
    id: 32, topic: "documents", difficulty: "medium",
    question: "A Learner's Licence in India is valid for:",
    options: ["30 days", "3 months", "6 months", "1 year"],
    correct: 2,
    explanation: "A Learner's Licence is valid for 6 months from the date of issue. You must obtain your permanent driving licence within this period.",
  },
  {
    id: 33, topic: "documents", difficulty: "medium",
    question: "The LMV-NT category on a driving licence stands for:",
    options: ["Large Motor Vehicle — New Type", "Light Motor Vehicle — Non-Transport", "Light Motorcycle — Night Transport", "Licensed Motor Vehicle — No Trailer"],
    correct: 1,
    explanation: "LMV-NT stands for Light Motor Vehicle Non-Transport — this is the category for personal cars, SUVs, and jeeps used for private purposes.",
  },
  {
    id: 34, topic: "documents", difficulty: "easy",
    question: "What is a PUC Certificate?",
    options: ["Public Utility Certificate for bus routes", "Pollution Under Control certificate", "Professional Use Certificate", "Permission for Urban Commuting"],
    correct: 1,
    explanation: "PUC (Pollution Under Control) is a certificate that confirms your vehicle's emission levels are within legal limits. It is mandatory for all vehicles and must be renewed periodically.",
  },
  {
    id: 35, topic: "documents", difficulty: "hard",
    question: "After getting a Learner's Licence, you must wait at least __ days before applying for the Permanent DL:",
    options: ["15 days", "30 days", "60 days", "90 days"],
    correct: 1,
    explanation: "You must hold your Learner's Licence for a minimum of 30 days before you can apply for the Permanent Driving Licence. The maximum gap is 180 days.",
  },
  {
    id: 36, topic: "documents", difficulty: "medium",
    question: "The penalty for driving without third-party insurance is:",
    options: ["₹1,000", "₹2,000", "₹5,000 + possible imprisonment", "₹10,000"],
    correct: 2,
    explanation: "Driving without third-party insurance is penalized with ₹2,000 for first offence and ₹4,000 for repeat offence under MV Act 2019. Third-party insurance is compulsory for all vehicles.",
  },

  // ─── DRUNK DRIVING ───
  {
    id: 37, topic: "drunk_driving", difficulty: "easy",
    question: "What is the legal Blood Alcohol Concentration (BAC) limit for drivers in India?",
    options: ["50 mg per 100 ml blood", "30 mg per 100 ml blood", "80 mg per 100 ml blood", "0 (zero tolerance)"],
    correct: 1,
    explanation: "The legal BAC limit in India is 30mg of alcohol per 100ml of blood — much stricter than many countries. Even one drink can push many people above this limit.",
  },
  {
    id: 38, topic: "drunk_driving", difficulty: "easy",
    question: "The fine for drunk driving (first offence) in India is:",
    options: ["₹2,000", "₹5,000", "₹10,000 + up to 6 months imprisonment", "₹1,000 + licence suspension"],
    correct: 2,
    explanation: "First offence for drunk driving: fine of ₹10,000 and/or up to 6 months imprisonment. Second offence within 3 years: ₹15,000 and/or up to 2 years imprisonment.",
  },
  {
    id: 39, topic: "drunk_driving", difficulty: "medium",
    question: "If you refuse to take a breathalyser test when requested by police, you:",
    options: ["Cannot be penalised", "Are assumed to be sober", "Can be treated as if you are drunk", "Must be taken to hospital for blood test first"],
    correct: 2,
    explanation: "Refusing a breathalyser test is treated as admission of drunk driving under Indian law. You can be arrested and prosecuted as if you had failed the test.",
  },
  {
    id: 40, topic: "drunk_driving", difficulty: "medium",
    question: "Drunk driving causing death is classified as:",
    options: ["Minor traffic offence — ₹10,000 fine", "Culpable homicide — up to 10 years imprisonment", "Negligent driving — 6 months imprisonment", "Rash driving — 2 years imprisonment"],
    correct: 1,
    explanation: "Under Section 304 IPC (now BNS), drunk driving causing death is culpable homicide not amounting to murder — punishable with up to 10 years imprisonment and fine.",
  },
  {
    id: 41, topic: "drunk_driving", difficulty: "hard",
    question: "Alcohol primarily impairs driving by:",
    options: ["Improving reflexes but reducing vision", "Reducing reaction time, impairing judgment and depth perception", "Causing drowsiness only — does not affect reaction time", "Only affecting night vision"],
    correct: 1,
    explanation: "Alcohol impairs multiple driving-critical functions: reaction time increases by 20–30%, depth perception and peripheral vision deteriorate, and decision-making judgment is significantly impaired.",
  },
  {
    id: 42, topic: "drunk_driving", difficulty: "medium",
    question: "Driving under the influence of drugs (not just alcohol) is:",
    options: ["Only penalised if the drugs are illegal", "Penalised the same as drunk driving", "Not covered under traffic laws", "Allowed if prescription medication"],
    correct: 1,
    explanation: "Driving under influence of any intoxicant — alcohol, illegal drugs, or prescription medicine that impairs ability — is penalised under Section 185 of the Motor Vehicles Act.",
  },

  // ─── HIGHWAY RULES ───
  {
    id: 43, topic: "highway_rules", difficulty: "easy",
    question: "On a multi-lane expressway in India, which lane should slow vehicles use?",
    options: ["The rightmost lane", "Any lane", "The leftmost (lane 1)", "The centre lane"],
    correct: 2,
    explanation: "On expressways, the leftmost lane (lane 1) is for slow-moving and heavy vehicles. The right lane(s) are for overtaking. Slow vehicles should never stay in the fast right lane.",
  },
  {
    id: 44, topic: "highway_rules", difficulty: "medium",
    question: "On an expressway, stopping on the main carriageway (except in emergency) is:",
    options: ["Allowed during daytime only", "Allowed to pick up/drop passengers quickly", "Strictly prohibited", "Allowed if hazard lights are on"],
    correct: 2,
    explanation: "Stopping on expressway main carriageways is strictly prohibited and extremely dangerous. In case of breakdown, move to the emergency lane and call for assistance.",
  },
  {
    id: 45, topic: "highway_rules", difficulty: "medium",
    question: "Two-wheelers (motorcycles/scooters) are allowed on expressways in India?",
    options: ["Yes, on all expressways", "No, they are prohibited on all expressways", "Only motorcycles above 150cc", "Depends on the expressway operator's rules"],
    correct: 3,
    explanation: "This varies — most expressways prohibit two-wheelers for safety reasons, but some allow them. Always check the sign at the expressway entry toll. Yamuna Expressway and many NH expressways ban two-wheelers.",
  },
  {
    id: 46, topic: "highway_rules", difficulty: "easy",
    question: "When you break down on a highway, you should:",
    options: ["Stay in your vehicle and wait", "Stand in the lane and signal for help", "Move vehicle to emergency/breakdown lane, switch on hazard lights, place warning triangle", "Call police from inside the vehicle"],
    correct: 2,
    explanation: "In a breakdown: move to the emergency lane, switch on hazard lights, place a warning triangle 50–100m behind the vehicle, and stay behind the barrier if possible. Never stand in the traffic lane.",
  },
  {
    id: 47, topic: "highway_rules", difficulty: "medium",
    question: "U-turns on expressways are:",
    options: ["Allowed at designated median openings", "Allowed anywhere if road is clear", "Prohibited everywhere", "Allowed for emergency vehicles only"],
    correct: 0,
    explanation: "U-turns on expressways are only permitted at designated authorized openings — these are clearly marked. Attempting a U-turn at an undesignated point is extremely dangerous and illegal.",
  },
  {
    id: 48, topic: "highway_rules", difficulty: "hard",
    question: "The minimum safe following distance at 100 km/h on a highway is approximately:",
    options: ["20 metres", "30 metres", "50–60 metres (3 seconds)", "10 metres"],
    correct: 2,
    explanation: "At 100 km/h, a vehicle travels ~28 metres per second. A minimum 3-second following distance (approximately 50–60 metres) is recommended. In wet conditions, double this distance.",
  },
  {
    id: 49, topic: "highway_rules", difficulty: "medium",
    question: "When entering an expressway from a slip road, you should:",
    options: ["Stop at the end of the slip road and wait for a gap", "Match the speed of expressway traffic and merge smoothly", "Use hazard lights while merging", "Expect main road vehicles to give way to you"],
    correct: 1,
    explanation: "When merging onto an expressway, accelerate on the slip road to match the speed of the main carriageway, check mirrors and blind spots, then merge smoothly when safe.",
  },
  {
    id: 50, topic: "highway_rules", difficulty: "easy",
    question: "On a National Highway at night, when should you dip your headlights?",
    options: ["Never — full beam is always safer", "Within 200m of an oncoming vehicle", "Only in villages and towns", "Only when police are present"],
    correct: 1,
    explanation: "You must dip (switch from full beam to low beam) within approximately 200 metres of an oncoming vehicle to avoid blinding them. Failing to dip lights can cause accidents.",
  },
  // Bonus questions
  {
    id: 51, topic: "traffic_signs", difficulty: "medium",
    question: "A triangular red sign with an exclamation mark (!) means:",
    options: ["Hospital ahead", "General hazard — proceed with caution", "No entry", "Road under construction"],
    correct: 1,
    explanation: "An exclamation mark in a red triangle is a general hazard/danger sign. It warns of an unspecified danger ahead and requires you to slow down and proceed with extra caution.",
  },
  {
    id: 52, topic: "road_rules", difficulty: "hard",
    question: "At a roundabout (traffic circle), who has the right of way?",
    options: ["Vehicles entering the roundabout", "Vehicles already circulating inside the roundabout", "Larger vehicles", "The vehicle on the right of the entry point"],
    correct: 1,
    explanation: "At roundabouts, vehicles already circulating inside have right of way. Vehicles entering must give way and merge only when safe. This is indicated by the 'Give Way' sign at roundabout entries.",
  },
  {
    id: 53, topic: "speed_limits", difficulty: "medium",
    question: "Speed governors (limiters) are mandatory for which vehicles?",
    options: ["All private cars", "Only sports cars", "Commercial vehicles — trucks, buses, taxis", "All vehicles above 1000cc"],
    correct: 2,
    explanation: "Speed governors/limiters are mandatory for all commercial transport vehicles including trucks, buses, and taxis. Cars and private motorcycles are not required to have them.",
  },
  {
    id: 54, topic: "documents", difficulty: "hard",
    question: "How long is a permanent driving licence valid in India?",
    options: ["5 years", "10 years or until age 50, whichever is earlier, then renewed every 5 years", "For lifetime", "20 years"],
    correct: 1,
    explanation: "A permanent DL is valid for 20 years from date of issue or until the licensee turns 50, whichever is earlier. It must then be renewed every 5 years.",
  },
  {
    id: 55, topic: "drunk_driving", difficulty: "easy",
    question: "Drinking coffee or energy drinks after consuming alcohol:",
    options: ["Speeds up alcohol metabolism and makes you safe to drive", "Makes you feel more alert but does not reduce BAC or impairment", "Is the same as waiting 2 hours", "Is recommended to counter alcohol effects"],
    correct: 1,
    explanation: "Coffee, energy drinks, or food do NOT reduce your blood alcohol concentration. Only time reduces BAC — at approximately 0.015% per hour. You may feel more awake but remain legally and physically impaired.",
  },
  {
    id: 56, topic: "highway_rules", difficulty: "medium",
    question: "When overtaking on a single-lane highway with clear visibility, you should:",
    options: ["Flash headlights, sound horn, overtake quickly from left", "Check mirrors, signal right, ensure clear road, accelerate and pass, return to left", "Wait for the vehicle ahead to signal permission", "Overtake from left to avoid oncoming traffic risk"],
    correct: 1,
    explanation: "Safe overtaking: check mirrors and ahead for oncoming vehicles, signal right, when clear accelerate to overtake, complete the pass quickly, signal left, and return to the left lane — all while not exceeding speed limit.",
  },
  {
    id: 57, topic: "road_rules", difficulty: "medium",
    question: "Not wearing a seatbelt as a rear seat passenger is:",
    options: ["Legal — only front seat seatbelts are mandatory", "Illegal and fined ₹1,000 per person", "Legal but driver is fined", "Only illegal on highways"],
    correct: 1,
    explanation: "Seatbelts are mandatory for ALL occupants — front and rear — under the MV Act 2019. The penalty is ₹1,000 per unbelted passenger. The driver can also be fined for passengers not wearing seatbelts.",
  },
  {
    id: 58, topic: "traffic_signs", difficulty: "hard",
    question: "A sign with 'NO PARKING' inside a red circle applies:",
    options: ["Only to heavy vehicles", "Only during the hours shown below the sign", "To all vehicles at all times unless hours are specified", "Only to commercial vehicles"],
    correct: 2,
    explanation: "A 'No Parking' sign applies to all vehicles at all times unless time restrictions are shown. If a time plate is displayed (e.g., 9am–6pm), parking is allowed outside those hours.",
  },
  {
    id: 59, topic: "speed_limits", difficulty: "hard",
    question: "A school bus displaying flashing amber lights (stopped to drop/pick up children) requires you to:",
    options: ["Overtake quickly before children cross", "Slow to 5 km/h and be ready to stop", "Stop completely and wait until lights stop flashing", "Flash lights to warn children"],
    correct: 2,
    explanation: "When a school bus displays flashing amber/red lights indicating children are boarding/alighting, you must stop and wait — in both directions on undivided roads. Only proceed when lights stop and children are safely on the pavement.",
  },
  {
    id: 60, topic: "highway_rules", difficulty: "easy",
    question: "Tractor-trailers and bullock carts on National Highways at night must have:",
    options: ["No specific requirements", "Reflective markings and working tail lights", "A person walking ahead with a torch", "Special permits only"],
    correct: 1,
    explanation: "All slow-moving vehicles (tractors, carts, etc.) on highways must have reflective markings and functional lights at night to be visible to faster traffic approaching from behind.",
  },
];

export function getQuestionsByTopic(topic: Topic): Question[] {
  return questions.filter((q) => q.topic === topic);
}

export function getMockTestQuestions(count = 30): Question[] {
  // Get 5 questions from each topic
  const perTopic = Math.floor(count / Object.keys(topicMeta).length);
  const topics = Object.keys(topicMeta) as Topic[];
  const selected: Question[] = [];

  topics.forEach((topic) => {
    const topicQs = getQuestionsByTopic(topic);
    const shuffled = [...topicQs].sort(() => Math.random() - 0.5);
    selected.push(...shuffled.slice(0, perTopic));
  });

  return selected.sort(() => Math.random() - 0.5);
}

export function getPracticeQuestions(topic: Topic, count = 5): Question[] {
  const topicQs = getQuestionsByTopic(topic);
  return [...topicQs].sort(() => Math.random() - 0.5).slice(0, count);
}