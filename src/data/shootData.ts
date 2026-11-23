export interface VideoReference {
  id: string;
  title: string;
  section: 'pre-launch' | 'launch' | 'scripted-ads' | 'ugc-drinks' | 'ugc-food' | 'ugc-asmr' | 'ugc-bags' | 'ugc-shoes' | 'ugc-slippers' | 'ugc-fashion';
  sectionName: string;
  categoryTag: string;
  url: string;
  platform: 'instagram' | 'tiktok' | 'twitter' | 'youtube' | 'facebook' | 'pinterest' | 'drive' | 'vimeo' | 'other';
  embedId: string;
  durationEst: string;
  hook: string;
  isNewlySynced?: boolean;
  sourceTab?: string;
  shootingDirection?: {
    cameraPositionAndFraming?: string;
    cameraMovement?: string;
    lightingAndSet?: string;
    actionBreakdown?: string;
    talentAndHandBlocking?: string;
    soundAndAudioCues?: string;
    propsAndGear?: string[];
    directorExecutionNotes?: string;
  };
}

export interface ChecklistCategory {
  id: string;
  title: string;
  items: string[];
}

export interface DocumentaryAct {
  actNumber: number;
  actTitle: string;
  visuals: string[];
  roles: {
    speaker: string;
    dialogue: string;
  }[];
  keyMessage?: string;
  shotDirection: string;
}

export interface ScriptScene {
  sceneNumber: number;
  title: string;
  timecode: string;
  setting: string;
  action: string;
  lines: {
    speaker: string;
    text: string;
    isVO?: boolean;
  }[];
  directorNotes: string;
}

export const SHOOT_CHECKLIST: ChecklistCategory[] = [
  {
    id: "content-creative",
    title: "1. CONTENT & CREATIVE",
    items: [
      "Finalise all video concepts",
      "Finalise scripts where necessary",
      "Prepare interview questions",
      "Prepare detailed shot list",
      "Confirm key messages for each video",
      "Confirm all required content deliverables",
      "Prepare reference videos where necessary",
      "Create shooting schedule",
      "Assign responsibilities for each content piece"
    ]
  },
  {
    id: "merchant-app",
    title: "2. CRAFTSQUARRE MERCHANT APP",
    items: [
      "Confirm latest app version on test phones",
      "Test app workflows before shoot starts",
      "Confirm all required features are working smoothly",
      "Prepare test merchant accounts with realistic data",
      "Prepare sample orders/products/inventory data",
      "Prepare storefronts for live demonstration",
      "Capture screen: Merchant dashboard (metrics & graph)",
      "Capture screen: Sales & revenue tracking",
      "Capture screen: Order management (confirming orders)",
      "Capture screen: Inventory management",
      "Capture screen: Storefront & link sharing flow",
      "Capture screen: Customer reviews"
    ]
  },
  {
    id: "camera-equipment",
    title: "3. CAMERA & PRODUCTION EQUIPMENT",
    items: [
      "Main camera (charged & sensor cleaned)",
      "Backup camera / iPhone 15/16 Pro with ProRes setup",
      "Lenses (Wide 24mm, Portrait 50mm/85mm, Macro for stitches)",
      "Tripod & fluid head",
      "Gimbal (balanced & calibrated)",
      "Wireless Lavalier microphones (DJI/Rode)",
      "Audio recorder & spare lav clips",
      "Key light (COB light with softbox/lantern)",
      "Light stands & c-stands",
      "5-in-1 Reflector / bounce boards",
      "Phone mounts & MagSafe clamps",
      "High-speed V60/V90 Memory cards (formatted)",
      "Full camera batteries (minimum 4)",
      "Chargers & multi-port charging hub",
      "High capacity power banks (20,000mAh+)",
      "Heavy duty extension cables & surge protector",
      "Laptop for on-set offloading",
      "External SSD drive (Sandisk Extreme or Samsung T7)"
    ]
  },
  {
    id: "location",
    title: "4. LOCATION & SET PREPARATION",
    items: [
      "Confirm location access & arrival timing with hosts",
      "Clean filming zones (remove stray cords & clutter)",
      "Prepare quiet interview area (check echo & acoustics)",
      "Identify 3 distinct aesthetic backgrounds for shoots",
      "Identify natural window lighting spots & sun angles",
      "Check background noise (AC hum, traffic, echoes)",
      "Arrange furniture, wooden tables, and styled props",
      "Prepare product shooting staging table (cloths, pedestals)",
      "Confirm power outlets & test voltage stability",
      "Ensure ample corridor space for camera crew movements"
    ]
  },
  {
    id: "content-capture",
    title: "5. CONTENT TO CAPTURE",
    items: [
      "Main app launch hero video",
      "App demonstration videos (hands-on UI)",
      "Merchant-focused promotional videos",
      "Short vertical social media hooks (TikTok/Reels)",
      "Clean screen recordings in 4K 60fps",
      "Launch cover photographs & thumbnail stills",
      "Founder interview: Origin story of Craftsquarre",
      "Founder interview: The visibility challenge solved",
      "Founder interview: Vision for Nigerian artisans & sellers",
      "Documentary B-Roll: Merchants cutting fabric, sewing, packaging",
      "Documentary B-Roll: Candid laughs, team huddles, authentic smiles"
    ]
  },
  {
    id: "photography",
    title: "6. PHOTOGRAPHY DELIVERABLES",
    items: [
      "Founder executive portraits (warm, authoritative, approachable)",
      "Team candid & group photographs",
      "Hero product-only macro stills (leather, ankara, drinks)",
      "Hands holding phone showing Craftsquarre app interface",
      "Natural merchant interaction candid portraits",
      "Behind-the-scenes production stills",
      "Vertical 9:16 social media story photographs",
      "Horizontal 16:9 press kit & website header photographs"
    ]
  },
  {
    id: "shoot-day",
    title: "7. SHOOT DAY EXECUTION",
    items: [
      "Share final call sheet & schedule on WhatsApp group",
      "Confirm arrival times of talent & merchants",
      "Assign participant coordinator",
      "Assign product & prop manager",
      "Assign shot-list manager & continuity checker",
      "Provide water, cold drinks & light refreshments",
      "Confirm all equipment batteries 100% full",
      "Run camera & wireless audio scratch tests",
      "Calibrate lighting color temperature (5600K balanced)",
      "Perform live dummy run on the merchant app",
      "Mid-day backup of footage to primary external SSD"
    ]
  },
  {
    id: "before-leaving",
    title: "8. BEFORE LEAVING THE LOCATION",
    items: [
      "Review master shot list against recorded takes",
      "Confirm all planned hero videos were captured with safety takes",
      "Confirm all visiting merchants were filmed on camera",
      "Confirm all required product hero B-roll is captured",
      "Confirm app UI screen interactions were recorded without glare",
      "Confirm founder interview audio is crystal clear with no clippings",
      "Confirm BTS footage and candid laughs captured",
      "Perform full dual backup of all memory cards to SSD 1 & 2",
      "Verify checksum/file size match across drives",
      "Pack up all cables, adapters, lav mics, and small props"
    ]
  },
  {
    id: "post-shoot",
    title: "9. POST-SHOOT WORKFLOW",
    items: [
      "Organise footage folders by Camera / Scene / Audio / Screen",
      "Organise RAW photographs & select selects",
      "Review all audio tracks and label best takes",
      "Flag any missing inserts or b-roll pickups",
      "Prepare editing schedule & deliverable timeline",
      "Assign video cuts to editors with sound references",
      "Set editing review milestones (Rough cut 48h)",
      "Schedule pre-launch hype content calendar",
      "Plan launch-day broadcast & influencer seeding",
      "Plan post-launch case study series"
    ]
  }
];

export const DOCUMENTARY_STRUCTURE: DocumentaryAct[] = [
  {
    actNumber: 1,
    actTitle: "ACT 1: THE PROBLEM — Hard Work in the Shadows",
    visuals: [
      "Cinematic slow-motion (60fps) of merchant hands measuring cloth",
      "Scissors slicing rich fabric, sewing machine needle rhythm",
      "Hands burnishing leather edges on custom bags",
      "Steam iron releasing puff over finished garments",
      "Late-night room illuminated solely by work lamp and phone notification screen",
      "Finished packages stacked ready for delivery"
    ],
    roles: [
      {
        speaker: "Narration (V.O.)",
        dialogue: "Every day across Nigeria, thousands of entrepreneurs are building. Not from factories. Not from large corporate offices. But from workshops, storefronts, spare rooms, and late nights that nobody sees.\n\nThey create products people love — built with skill, care, creativity, and consistency.\n\nYet for many of them, creating the product is not the hardest part. Being seen is."
      },
      {
        speaker: "Merchant Soundbites",
        dialogue: "\"The challenge isn't making a good product.\"\n\"It's getting people to discover it.\"\n\"There are so many businesses online.\"\n\"You can create something beautiful and still struggle to get noticed.\""
      }
    ],
    keyMessage: "The biggest challenge for product entrepreneurs is discovery, not talent.",
    shotDirection: "Shoot with shallow depth of field (f/1.8 or f/2.8) to isolate the artisan's hands. Keep the lighting warm and moody. Capture crisp foley sound of scissors snip and leather mallet tap. Frame merchants facing slightly off-camera for intimate, raw soundbites."
  },
  {
    actNumber: 2,
    actTitle: "ACT 2: THE DISCOVERY — Hearing the Merchant's Cry",
    visuals: [
      "Team clustered around whiteboard filled with sticky notes",
      "Reviewing WhatsApp messages and real customer DM screenshots",
      "Listening intently on speakerphone to seller struggles",
      "Split screen of diverse sellers across fashion, footwear, drinks, and craft",
      "Early platform wireframes sketched on iPad"
    ],
    roles: [
      {
        speaker: "Founder",
        dialogue: "When we started speaking with merchants, we kept hearing the same thing. Again and again. People weren't asking for shortcuts. They weren't asking for miracles. They wanted visibility."
      },
      {
        speaker: "Marketing Team Lead",
        dialogue: "There are amazing businesses creating incredible products every day. The challenge isn't talent. The challenge is discovery. Many great brands simply aren't being seen."
      },
      {
        speaker: "Merchant Voices",
        dialogue: "\"Getting discovered changes everything.\"\n\"You can have a great product and still remain hidden.\""
      }
    ],
    keyMessage: "Craftsquarre identified that Nigerian merchants need an active discovery engine, not another passive store.",
    shotDirection: "Medium two-shots and over-the-shoulder perspectives to give a documentary, fly-on-the-wall feeling. Maintain natural ambient lighting with subtle soft key to keep skin tones rich and warm."
  },
  {
    actNumber: 3,
    actTitle: "ACT 3: BUILDING THE SOLUTION — Engineering for Agility",
    visuals: [
      "Engineering team writing code, testing real phone simulators",
      "Design team zooming into mobile UX components and micro-interactions",
      "Merchant studio visit: team filming merchant inventory live on site",
      "Whiteboard roadmap diagram with 'Inventory', 'Storefront', 'Visibility'",
      "Fast-paced editing transition showing code turning into interface"
    ],
    roles: [
      {
        speaker: "Engineering Lead",
        dialogue: "Every feature starts with a merchant problem. We constantly ask ourselves: How can we make selling easier? How can we help merchants become more visible?"
      },
      {
        speaker: "Marketing Lead",
        dialogue: "Visibility doesn't happen by accident. It takes storytelling. It takes content. It takes systems. It takes intentional effort. We're constantly looking for ways to help merchants get discovered."
      },
      {
        speaker: "Founder",
        dialogue: "The more merchants we worked with, the clearer the challenge became. Many of them were running their businesses on the move. Managing products. Managing orders. Responding to customers. Trying to stay visible."
      }
    ],
    keyMessage: "Built by listening to real on-the-ground problems rather than theoretical tech features.",
    shotDirection: "Dynamic handheld camera moves. Whip pans between designer's screen and developer's phone. Use screen recording overlays with 3D perspective to make app architecture feel tangible."
  },
  {
    actNumber: 4,
    actTitle: "ACT 4: WHY THE APP — The Business in Your Pocket",
    visuals: [
      "Merchant on transit / walking through market checking order alert on phone",
      "Finger smoothly tapping 'Accept Order' on Craftsquarre Merchant App",
      "Uploading new shoe photos with 3 quick taps right from phone camera",
      "Push notification chime: 'New Customer Discovered Your Store'",
      "Side-by-side: chaotic paper invoice book replaced by sleek dashboard graph"
    ],
    roles: [
      {
        speaker: "Founder",
        dialogue: "We realized merchants needed more flexibility. Many were already using the Craftsquarre web platform. But business doesn't only happen behind a laptop. Business happens everywhere.\n\nSo we asked ourselves: How do we make it easier for merchants to manage their businesses wherever they are? That's what led us to build the Craftsquarre Merchant App. Not because we wanted another product, but because we wanted merchants to have their businesses in their pockets."
      },
      {
        speaker: "Engineering Lead",
        dialogue: "Everything a merchant needs. Accessible anywhere. Anytime."
      },
      {
        speaker: "Marketing Lead",
        dialogue: "The mission remains the same: Visibility. The app simply helps us do it better."
      }
    ],
    keyMessage: "Empowering commerce on the go — no laptop required.",
    shotDirection: "High-contrast hero lighting on the smartphone screen. Follow-cam tracking behind the merchant as they walk through real workspace environments."
  },
  {
    actNumber: 5,
    actTitle: "ACT 5: THE PROOF — When Visibility Meets Craft",
    visuals: [
      "Merchant proudly holding up completed bespoke leather backpack",
      "Customer opening package and gasping in genuine delight",
      "5-star review appearing on merchant's phone in real time",
      "Merchant wrapping package with branded sticker and smiling directly into camera",
      "Bustling montage of diverse businesses shipping orders across states"
    ],
    roles: [
      {
        speaker: "Merchants Chorus",
        dialogue: "\"People are discovering our products.\"\n\"We've reached new audiences in cities we never thought of.\"\n\"Visibility has created real consistent orders.\"\n\"More people are finally seeing our work.\""
      },
      {
        speaker: "Narration (V.O.)",
        dialogue: "Different journeys. One common challenge: Being seen. One common opportunity: Visibility."
      }
    ],
    keyMessage: "Visibility produces dignity, sustainable revenue, and pride.",
    shotDirection: "Eye-level portraits looking straight down barrel of lens with genuine warm smiles. High key, vibrant natural daylight. Uplifting strings audio transition."
  },
  {
    actNumber: 6,
    actTitle: "ACT 6: THE FUTURE — Built To Be Seen",
    visuals: [
      "Founder looking ahead toward workshop horizon",
      "Artisans and merchants working with renewed energy and speed",
      "Montage: Tailor cutting fabric, cobbler stitching sole, barista sealing beverage bottle",
      "Phone rotating in 3D displaying the Craftsquarre logo and tagline",
      "Screen text card: 'BUILT TO BE SEEN — The Craftsquarre Merchant App — NOW LIVE'"
    ],
    roles: [
      {
        speaker: "Founder",
        dialogue: "This isn't the end of the journey. It's the next chapter. A chapter where more merchants can access better tools, reach more people, and grow their businesses."
      },
      {
        speaker: "Marketing Team",
        dialogue: "We'll continue helping merchants tell their stories."
      },
      {
        speaker: "Engineering Team",
        dialogue: "We'll continue building tools that help them succeed."
      },
      {
        speaker: "Merchants Together",
        dialogue: "\"We're only getting started.\""
      }
    ],
    keyMessage: "A movement for creative entrepreneurship.",
    shotDirection: "Heroic slow motion push-in. Epic cinematic crescendo. Fade to clean brand endboard with crisp typographic lockup: 'CRAFTSQUARRE — Built To Be Seen'."
  }
];

export const MIND_OF_A_MERCHANT_SCRIPT: ScriptScene[] = [
  {
    sceneNumber: 1,
    title: "Scene 1: Five Minutes of Peace",
    timecode: "00:00 – 00:08 (8s)",
    setting: "Interior room / Cafe or studio table with clean aesthetic",
    action: "Tosin sits at a wooden table with a condensation-beaded cold drink. She leans back, lets out a long breath, and closes her eyes to savour a peaceful moment.",
    lines: [
      { speaker: "NARRATOR (V.O.)", text: "Tosin...", isVO: true },
      { speaker: "TOSIN", text: "Hmm?" },
      { speaker: "NARRATOR (V.O.)", text: "Aren't you forgetting something?", isVO: true },
      { speaker: "TOSIN", text: "Shhh. I'm trying to relax." }
    ],
    directorNotes: "Framing: Medium close-up on Tosin. Relaxed posture, soft warm lighting. Sound of ice clinking gently in glass. Pacing should feel calm before comedic tension starts."
  },
  {
    sceneNumber: 2,
    title: "Scene 2: The Business Won't Let Her Rest",
    timecode: "00:08 – 00:19 (11s)",
    setting: "Interior table",
    action: "Her phone buzzes loudly on table. A comedic disembodied hand enters from left and slams a messy order ledger on table. Another hand enters from right and drops a pen, followed immediately by a heavy roll of packing tape.",
    lines: [
      { speaker: "NARRATOR (V.O.)", text: "Those orders you still need to confirm. The stock you need to check...", isVO: true },
      { speaker: "TOSIN", text: "Can I not even breathe for five minutes?" }
    ],
    directorNotes: "Framing: Tight top-down / medium angle. Rapid comedic object drops synced with sharp foley 'thud' and tape screech. Tosin glances wide-eyed at the chaos."
  },
  {
    sceneNumber: 3,
    title: "Scene 3: The Visibility Problem",
    timecode: "00:19 – 00:29 (10s)",
    setting: "Exterior walkway / Modern architectural corridor with greenery",
    action: "Tosin gets up frustrated and paces outdoors to clear her head. The camera tracks smoothly backward ahead of her.",
    lines: [
      { speaker: "NARRATOR (V.O.)", text: "And when are new customers supposed to discover your products?", isVO: true },
      { speaker: "TOSIN", text: "Between confirming orders, keeping track of stock, and everything else that comes with running my business, when am I supposed to make time to get my products seen?" }
    ],
    directorNotes: "Framing: Gimbal tracking shot at eye level. Tosin gestures naturally with hands. Natural daylight, gentle breeze. Tone is relatable frustration every small business owner feels."
  },
  {
    sceneNumber: 4,
    title: "Scene 4: Discovering Craftsquarre",
    timecode: "00:29 – 00:41 (12s)",
    setting: "Exterior walkway",
    action: "Tosin pauses, pulls her smartphone from pocket with sudden realization, and taps open the Craftsquarre Merchant App. We punch in to an over-the-shoulder macro screen shot.",
    lines: [
      { speaker: "NARRATOR (V.O.)", text: "With Craftsquarre, you can set up your store, list your products, and manage your business from your phone.", isVO: true }
    ],
    directorNotes: "Framing: Cut between Tosin's face lighting up and a sharp, glare-free insert of the app UI. Highlight Storefront, Product Catalog, and One-Tap Order Confirmation. Finger scrolls effortlessly."
  },
  {
    sceneNumber: 5,
    title: "Scene 5: One More Beautiful Thing",
    timecode: "00:41 – 00:53 (12s)",
    setting: "Interior table",
    action: "Tosin returns to her original table. Her chilled drink is waiting. She sits comfortably, holding the phone effortlessly.",
    lines: [
      { speaker: "NARRATOR (V.O.)", text: "And one more beautiful thing...", isVO: true },
      { speaker: "TOSIN", text: "What's that?" },
      { speaker: "NARRATOR (V.O.)", text: "With Craftsquarre, your products don't just have a place to be found. You also get marketing support to help more people discover what you sell.", isVO: true }
    ],
    directorNotes: "Visual montage insert (0:47–0:52): Quick 0.5s flashes of merchant products (hand-stitched bag, artisanal drinks, stylish tailored outfit) with subtle 'DISCOVERED' badge popups."
  },
  {
    sceneNumber: 6,
    title: "Scene 6: Finally, That Drink",
    timecode: "00:53 – 00:57 (4s)",
    setting: "Interior table",
    action: "Tosin picks up her cold drink, takes a deeply satisfying, triumphant sip, and shoots a knowing, confident smile into the lens.",
    lines: [
      { speaker: "NARRATOR (V.O.)", text: "Craftsquarre Merchant App. Your whole business. Right on your phone.", isVO: true }
    ],
    directorNotes: "Framing: Punch punch punch! Tight macro on cold glass, smile, then lock eye contact with viewer. Confident, relieved, empowered."
  },
  {
    sceneNumber: 7,
    title: "Scene 7: Brand End Card",
    timecode: "00:57 – 01:00 (3s)",
    setting: "Motion Graphic Endboard",
    action: "Clean dark slate card with golden amber Craftsquarre logo, app store download badges, and hero copy.",
    lines: [
      { speaker: "GRAPHIC / VO", text: "CRAFTSQUARRE — Your whole business. Right on your phone. Sign up for free.", isVO: true }
    ],
    directorNotes: "Sonic branding: subtle upbeat chime and tactile app click. Keep text bold, center-aligned, and legible on mobile screens."
  }
];

export const VIDEO_REFERENCES: VideoReference[] = [
  // ================= PRE-LAUNCH =================
  {
    id: "pre-1",
    title: "Pre-Launch Reference: Rapid Cut Teaser Reel",
    section: "pre-launch",
    sectionName: "Pre-Launch",
    categoryTag: "Reel / Teaser",
    url: "https://www.instagram.com/reel/Dcgu6XARH2h/?stkn=NjdnZmF2NTByNzdh",
    platform: "instagram",
    embedId: "Dcgu6XARH2h",
    durationEst: "15s",
    hook: "Rapid 0.2s glitch cuts between crafting hands and tool textures with countdown audio",
    shootingDirection: {
      cameraPositionAndFraming: "Vertical 9:16. Camera mounted at eye-level 3 feet from talent for medium shot, then cut to macro 6 inches from hands (50mm lens).",
      cameraMovement: "Snap zoom / fast whip-pans between takes. Handheld with subtle camera shake to build visceral urgency.",
      lightingAndSet: "Moody directional key light at 45° angle. Deep contrast shadows. Background kept dark and out of focus.",
      actionBreakdown: "• 0:00–0:03: 3 rapid 0.3s micro-cuts: measuring cloth, scissors snipping, hand turning leather.\n• 0:03–0:08: Subject pauses, glances directly down the lens.\n• 0:08–0:12: Phone placed face down or held in hand with glowing screen.\n• 0:12–0:15: Cut to black with title card text.",
      talentAndHandBlocking: "Talent works rapidly with high energy. Hands stay in central third of 9:16 frame. Snappy decisive movements.",
      soundAndAudioCues: "Accelerating bass heartbeat thumps. Foley snip and click on each cut. Sudden silence at 0:12 before final beat.",
      propsAndGear: ["Handheld rig / 50mm f/1.8", "Workshop tools (shears, tape, chalk)", "Amber LED tube light"],
      directorExecutionNotes: "Shoot every angle for at least 5 seconds so the editor has clean head/tail frames to cut on the beat."
    }
  },
  {
    id: "pre-2",
    title: "Pre-Launch Reference: Creator Problem POV",
    section: "pre-launch",
    sectionName: "Pre-Launch",
    categoryTag: "Reel / Story Hook",
    url: "https://www.instagram.com/reel/DcvfMNzqBff/?stkn=MTcyMGZ0aW1kZ3d6eg==",
    platform: "instagram",
    embedId: "DcvfMNzqBff",
    durationEst: "18s",
    hook: "Subject sits beside full stack of finished inventory, exhales, and looks at empty phone screen",
    shootingDirection: {
      cameraPositionAndFraming: "Vertical 9:16. Camera on tripod at eye level, 4 feet away. Framing: Medium shot showing creator and their stacked products in the same frame.",
      cameraMovement: "Slow deliberate push-in toward the creator's face over 10 seconds.",
      lightingAndSet: "Natural window light from camera right acting as soft key. Warm ambient interior.",
      actionBreakdown: "• 0:00–0:04: Creator carefully adjusts last product on table, steps back to admire work.\n• 0:04–0:09: Creator sits down, checks phone screen, taps screen twice waiting.\n• 0:09–0:15: Creator sighs subtly, looks toward camera with relatable tired expression.\n• 0:15–0:18: Text overlay pops up.",
      talentAndHandBlocking: "Natural, unhurried body language. Hand holds phone casually on lap, screen facing talent then tilted toward lens.",
      soundAndAudioCues: "Soft acoustic strumming. Natural room silence. Notification vibration sound effect.",
      propsAndGear: ["Tripod with fluid head / 35mm lens", "Table with stacked products", "Phone"],
      directorExecutionNotes: "Direct the actor to deliver a subtle, dignified micro-expression rather than melodrama."
    }
  },
  {
    id: "pre-3",
    title: "Pre-Launch Reference: Overhead Mobile Flat Lay",
    section: "pre-launch",
    sectionName: "Pre-Launch",
    categoryTag: "Reel / Overhead Flat Lay",
    url: "https://www.instagram.com/reel/DXEKh5tDEtE/?stkn=ZXIzNDR0MDZvMHE0",
    platform: "instagram",
    embedId: "DXEKh5tDEtE",
    durationEst: "12s",
    hook: "Hand places phone directly in center of overhead workspace surrounded by artisan tools",
    shootingDirection: {
      cameraPositionAndFraming: "Strict 90° top-down flat lay (overhead rig). Phone positioned in dead center of the vertical 9:16 frame.",
      cameraMovement: "Locked off overhead on C-stand. Punch-in edit at 0:04 to 45° over-the-shoulder angle.",
      lightingAndSet: "Even overhead softbox lighting to eliminate hard hand shadows across the tabletop.",
      actionBreakdown: "• 0:00–0:03: Empty table with tools arranged neatly. Hand enters from bottom and places phone down with authoritative tap.\n• 0:03–0:07: Index finger taps screen, thumbnail scrolls through catalog.\n• 0:07–0:12: Finger taps green confirm button, screen flashes confirmation checkmark.",
      talentAndHandBlocking: "Keep fingers clean and manicured. Thumb or index finger must not block the screen content while tapping.",
      soundAndAudioCues: "Solid wooden table thud as phone lands, tactile screen tap click, upbeat electronic drop.",
      propsAndGear: ["C-stand with overhead boom arm", "Clean wooden desk", "Smartphone at 100% brightness"],
      directorExecutionNotes: "Wipe down the phone screen with a microfiber cloth immediately before every take."
    }
  },

  // ================= LAUNCH =================
  {
    id: "launch-1",
    title: "Launch Hero Reference: Multi-Creator Montage Anthem",
    section: "launch",
    sectionName: "Launch Announcements",
    categoryTag: "Launch Reel Anthem",
    url: "https://www.instagram.com/reel/DcSrQgkTyNC/?stkn=ZWk4bmRkZGNicnFo",
    platform: "instagram",
    embedId: "DcSrQgkTyNC",
    durationEst: "30s",
    hook: "Fast consecutive cuts of 4 different creators looking up into the lens smiling with their products",
    shootingDirection: {
      cameraPositionAndFraming: "Vertical 9:16. Eye level 35mm lens. Subject framed in center-third of frame in each setup.",
      cameraMovement: "Consistent forward tracking push (gimbal) moving toward each subject at identical walking pace.",
      lightingAndSet: "Vibrant balanced daylight or warm studio setup. Consistent color temperature across all 4 setups.",
      actionBreakdown: "• 0:00–0:08: Setup 1: Fashion designer holding garment, looks up and smiles.\n• 0:08–0:15: Setup 2: Footwear maker holding shoe sole, steps forward.\n• 0:15–0:22: Setup 3: Bag maker zipping tote bag.\n• 0:22–0:30: Setup 4: Beverage maker pouring bottle, toasts to camera.",
      talentAndHandBlocking: "Every creator holds their product proudly at chest height, then makes direct 100% eye contact with camera lens.",
      soundAndAudioCues: "Driving cinematic percussion with four-on-the-floor kick drum building to crescendo.",
      propsAndGear: ["Gimbal stabilizer", "35mm prime lens", "4 sets of hero products"],
      directorExecutionNotes: "Maintain identical camera push speed across all setups so the edit cuts seamlessly."
    }
  },
  {
    id: "launch-2",
    title: "Launch Reference: 3-Step Screen & Face Split",
    section: "launch",
    sectionName: "Launch Announcements",
    categoryTag: "Step-by-Step Reel",
    url: "https://www.instagram.com/reel/DbzYVlBxA4_/?stkn=MTdmYmJqZDRicmUxdw==",
    platform: "instagram",
    embedId: "DbzYVlBxA4_",
    durationEst: "25s",
    hook: "Creator counts with fingers directly to camera: '1, 2, 3 and you are live'",
    shootingDirection: {
      cameraPositionAndFraming: "Vertical 9:16. Medium close-up on creator (chest up). Camera locked off at eye level on tripod, 3 feet away.",
      cameraMovement: "Locked off static shot with digital punch-ins (1.2x scale) on each numbered step.",
      lightingAndSet: "Clean ring light or 2-point softbox setup. Background is a tidy studio wall or shelf.",
      actionBreakdown: "• 0:00–0:05: Creator looks at lens, speaks hook with energetic smile.\n• 0:05–0:11: Holds up 1 finger: describes first action.\n• 0:11–0:18: Holds up 2 fingers: describes second action.\n• 0:18–0:25: Holds up 3 fingers: snaps fingers on final delivery.",
      talentAndHandBlocking: "Energetic hand gestures, keeping hands within frame boundaries without blocking mouth or eyes.",
      soundAndAudioCues: "Clean lavalier microphone audio. Pop sound effect on finger counts 1, 2, 3.",
      propsAndGear: ["Wireless lavalier mic", "Tripod", "Key light + softbox"],
      directorExecutionNotes: "Direct talent to deliver with high energy, smiling eyes, and brisk speech cadence."
    }
  },
  {
    id: "launch-3",
    title: "Launch Reference: Transit POV Mobile Notification",
    section: "launch",
    sectionName: "Launch Announcements",
    categoryTag: "Lifestyle POV",
    url: "https://www.instagram.com/reels/DdO7omTPaEO/",
    platform: "instagram",
    embedId: "DdO7omTPaEO",
    durationEst: "20s",
    hook: "Camera looking over passenger shoulder in moving vehicle as phone receives order chime",
    shootingDirection: {
      cameraPositionAndFraming: "Vertical 9:16 over-the-shoulder shot. Phone screen occupies 50% of the lower-center frame, blurred car window in background.",
      cameraMovement: "Handheld following natural car movement without excessive jerkiness.",
      lightingAndSet: "Natural daytime light through car passenger window. Screen brightness at 100%.",
      actionBreakdown: "• 0:00–0:05: Person looking out window, holding phone resting on knee.\n• 0:05–0:09: Notification pops up on screen with sound.\n• 0:09–0:15: Thumb unlocks phone, swipes into dashboard, taps confirm.\n• 0:15–0:20: Person tilts head back with satisfied smile.",
      talentAndHandBlocking: "Natural one-handed phone grip. Quick decisive thumb tap.",
      soundAndAudioCues: "Subtle vehicle engine hum. Loud clear notification bell chime. Satisfied breath exhale.",
      propsAndGear: ["Vehicle interior", "Smartphone with pre-set screen notifications"],
      directorExecutionNotes: "Shoot on a smooth straight road to avoid camera shake during the thumb tap."
    }
  },
  {
    id: "launch-4",
    title: "Launch Reference: Candid Hands-on User Reactions",
    section: "launch",
    sectionName: "Launch Announcements",
    categoryTag: "Reaction Reel",
    url: "https://www.instagram.com/reels/DdTm0hiThma/",
    platform: "instagram",
    embedId: "DdTm0hiThma",
    durationEst: "28s",
    hook: "Close-up of subject's eyebrows raising in surprise while looking at phone screen",
    shootingDirection: {
      cameraPositionAndFraming: "Vertical 9:16 tight portrait shot (50mm lens, 3 feet away), then quick cut to over-the-shoulder screen view.",
      cameraMovement: "Handheld documentary style, tracking natural head movements.",
      lightingAndSet: "Natural workspace lighting with soft reflector bounce on subject's face.",
      actionBreakdown: "• 0:00–0:06: Subject stares intently at screen, silent concentration.\n• 0:06–0:12: Expression breaks into wide spontaneous smile, chuckles.\n• 0:12–0:20: Points finger at screen showing something to person off-camera.\n• 0:20–0:28: Speaks enthusiastic soundbite directly into camera.",
      talentAndHandBlocking: "Spontaneous, relaxed posture. Do not over-choreograph hands.",
      soundAndAudioCues: "Real room laughter and dialogue recorded via lapel mic.",
      propsAndGear: ["Shoulder rig / gimbal", "50mm f/1.8", "Clip-on lav mic"],
      directorExecutionNotes: "Keep rolling between takes to catch authentic unscripted laughter and genuine reactions."
    }
  },
  {
    id: "launch-5",
    title: "Launch Reference: Cinematic Craft Texture Montage",
    section: "launch",
    sectionName: "Launch Announcements",
    categoryTag: "Brand Manifesto Reel",
    url: "https://www.instagram.com/reels/DdHYqjsOKmy/",
    platform: "instagram",
    embedId: "DdHYqjsOKmy",
    durationEst: "30s",
    hook: "Extreme macro slow-motion glide across leather grain and fabric weave",
    shootingDirection: {
      cameraPositionAndFraming: "Vertical 9:16. Macro lens (100mm equivalent or 3x telephoto) positioned 4 inches from product surface.",
      cameraMovement: "Silky smooth motorized slider or slow manual pan at 60fps slowed to 24fps.",
      lightingAndSet: "Low-angle side rim lighting (raking light) to exaggerate three-dimensional surface texture.",
      actionBreakdown: "• 0:00–0:08: Shot 1: Needle puncturing thick leather in slow motion.\n• 0:08–0:16: Shot 2: Hand brushing wood shavings or fabric fibers away.\n• 0:16–0:24: Shot 3: Polished brass zipper gliding shut.\n• 0:24–0:30: Wide shot: Maker stepping back, holding finished product.",
      talentAndHandBlocking: "Artisan hands move with precision, care, and slow intentionality.",
      soundAndAudioCues: "Deep resonant bass ambient drone. Crisp foley texture scrape and zipper glide.",
      propsAndGear: ["Macro lens", "Camera slider / steady gimbal", "High CRI spotlight"],
      directorExecutionNotes: "Focus must stay pinned on the leading edge of movement throughout the macro pan."
    }
  },

  // ================= SCRIPTED ANNOUNCEMENT LAUNCH CONTENTS =================
  {
    id: "script-phone-call",
    title: "Phone Call AD Reference: The Panicked Multitasker",
    section: "scripted-ads",
    sectionName: "Scripted Launch Ads",
    categoryTag: "Phone Call AD Format",
    url: "https://www.instagram.com/reel/DbZ2Q3yNqjx/?stkn=MXh6dnBza3p1eDA5ZA==",
    platform: "instagram",
    embedId: "DbZ2Q3yNqjx",
    durationEst: "35s",
    hook: "Actor with phone squeezed between neck and shoulder frantically searching messy desk papers",
    shootingDirection: {
      cameraPositionAndFraming: "Vertical 9:16. Medium shot from waist up, camera at eye level on tripod 4 feet away.",
      cameraMovement: "Snap zooms (quick push-in 1.3x) during comedic panic moments.",
      lightingAndSet: "Everyday indoor office/desk lighting. Desk deliberately cluttered with paper receipts, sticky notes, pens.",
      actionBreakdown: "• 0:00–0:07: Actor talks animatedly on phone clamped against ear, flipping papers frantically.\n• 0:07–0:15: Pen rolls off table, actor catches it, drops papers on floor, looks overwhelmed.\n• 0:15–0:24: Second person calmly places a phone in front of them showing clean digital interface.\n• 0:24–0:35: Actor looks at screen, sigh of relief, taps once and leans back.",
      talentAndHandBlocking: "Actor uses exaggerated comedic head tilt for phone hold. Rapid hand movements shuffling papers.",
      soundAndAudioCues: "Audible muffled voice through phone speaker. Paper rustling, pen drop click, comedic record scratch.",
      propsAndGear: ["Desk, chair", "Receipts, ledger, sticky notes, packing tape", "Two smartphones"],
      directorExecutionNotes: "Time the comedic snap zoom exactly to the moment the actor drops papers for maximum humor."
    }
  },
  {
    id: "script-founder",
    title: "Founder Announcement AD Reference: Direct Walk & Talk",
    section: "scripted-ads",
    sectionName: "Scripted Launch Ads",
    categoryTag: "Founder Address",
    url: "https://www.instagram.com/p/DeAvkxeALA3/?stkn=c3RvZGx3eXdwd3Vp",
    platform: "instagram",
    embedId: "DeAvkxeALA3",
    durationEst: "45s",
    hook: "Founder walks toward camera in active workshop, talking with direct friendly eye contact",
    shootingDirection: {
      cameraPositionAndFraming: "Vertical 9:16. Medium-wide shot (28mm-35mm lens) framed from waist to head with comfortable headroom.",
      cameraMovement: "Gimbal operator walks backward smoothly ahead of founder at matching pace.",
      lightingAndSet: "Well-lit authentic workshop or creative space with natural background movement (artisans working).",
      actionBreakdown: "• 0:00–0:12: Founder starts walking, gestures with open hands while speaking.\n• 0:12–0:25: Passes by work table, briefly touches a finished product on table without stopping.\n• 0:25–0:38: Slows to a gentle stop, pulls phone from pocket, displays screen toward camera.\n• 0:38–0:45: Final direct-to-lens smile and closing call-to-action.",
      talentAndHandBlocking: "Natural forward stride, conversational hand gestures. Do not cross arms or hold hands behind back.",
      soundAndAudioCues: "Wireless lav mic with windshield. Background workshop sounds kept at low ambient level.",
      propsAndGear: ["Gimbal stabilizer", "Wireless lav mic system", "Styled workshop corridor"],
      directorExecutionNotes: "Rehearse the walking path twice with the camera operator to prevent sudden speed adjustments."
    }
  },
  {
    id: "script-laptop",
    title: "Scripted Documentary AD Reference: Screen to Real World",
    section: "scripted-ads",
    sectionName: "Scripted Launch Ads",
    categoryTag: "Screen Transition Format",
    url: "https://www.instagram.com/reels/DbN6R_6NEWE/",
    platform: "instagram",
    embedId: "DbN6R_6NEWE",
    durationEst: "30s",
    hook: "Tight shot on laptop keyboard, fingers type rapidly, then hand closes laptop lid decisively",
    shootingDirection: {
      cameraPositionAndFraming: "Vertical 9:16. Start with close-up 45° angle on laptop keyboard and screen, then cut to eye level portrait.",
      cameraMovement: "Locked off on desk, followed by dynamic whip pan to phone in hand.",
      lightingAndSet: "Cool blue monitor glow contrasting with warm desk lamp light.",
      actionBreakdown: "• 0:00–0:08: Close-up on fingers typing on keyboard, screen reflected in glasses or eyes.\n• 0:08–0:14: Hand closes laptop with firm snap.\n• 0:14–0:22: Hand picks up smartphone from desk, slips it into back pocket.\n• 0:22–0:30: Person stands up, walks out of dark room into bright sunlight.",
      talentAndHandBlocking: "Decisive, confident hand actions. No hesitation when closing laptop and grabbing phone.",
      soundAndAudioCues: "Mechanical keyboard clicking, solid laptop lid closure snap, footsteps walking away.",
      propsAndGear: ["Laptop", "Desk setup with lamp", "Smartphone"],
      directorExecutionNotes: "Sync the laptop lid closure sound effect with a visual flash transition."
    }
  },
  {
    id: "script-nonface-ugc",
    title: "Non-Face UGC Reference: Hands-Only Order Pack & Seal",
    section: "scripted-ads",
    sectionName: "Scripted Launch Ads",
    categoryTag: "Faceless UGC Format",
    url: "https://x.com/danclipping/status/2078147137049923751",
    platform: "twitter",
    embedId: "2078147137049923751",
    durationEst: "20s",
    hook: "Hands fold crisp branded tissue paper over product and stick branded sticker with satisfying rub",
    shootingDirection: {
      cameraPositionAndFraming: "Vertical 9:16. Top-down 60° overhead angle mounted 2.5 feet above packing table. Tight crop on hands and box.",
      cameraMovement: "Static locked off on rigid tripod/arm to maintain crisp symmetry.",
      lightingAndSet: "Twin softboxes on left and right at 45° to illuminate table surface evenly with zero harsh shadows.",
      actionBreakdown: "• 0:00–0:05: Hands place product inside open shipping box on top of tissue paper.\n• 0:05–0:10: Folds left tissue flap, then right flap, presses round sticker firmly on seam.\n• 0:10–0:15: Closes cardboard lid, rolls packing tape across seam with tape gun.\n• 0:15–0:20: Applies shipping label, taps top of box twice with knuckles.",
      talentAndHandBlocking: "Clean manicured hands. Smooth, deliberate, satisfying packing actions with no fumbling.",
      soundAndAudioCues: "Crisp ASMR foley: tissue crinkle, sticker peel and stick, loud tape dispenser pull, double knuckle tap.",
      propsAndGear: ["Rigid shipping box", "Tissue paper, round stickers", "Tape dispenser", "Overhead mount"],
      directorExecutionNotes: "Place microphone 6 inches from the packaging surface to capture every tactile paper sound."
    }
  },
  {
    id: "script-reaction-demo",
    title: "Reaction + App Demo Reference: Screen Overlay + Talking Head",
    section: "scripted-ads",
    sectionName: "Scripted Launch Ads",
    categoryTag: "Reaction & Demo Format",
    url: "https://x.com/danclipping/status/2078147137049923751",
    platform: "twitter",
    embedId: "2078147137049923751",
    durationEst: "30s",
    hook: "Creator points up toward large animated screen recording: 'Wait, stop scrolling and look at this'",
    shootingDirection: {
      cameraPositionAndFraming: "Vertical 9:16. Creator framed in bottom-left third, leaving upper and right two-thirds open for screen demo PIP.",
      cameraMovement: "Locked off tripod at eye level.",
      lightingAndSet: "Flattering ring light or soft key directly behind camera. Clean solid-color background.",
      actionBreakdown: "• 0:00–0:06: Creator leans in close to lens, points up at empty space where video screen will appear.\n• 0:06–0:16: Creator looks up at the screen demo, reacts with nods and pointing.\n• 0:16–0:24: Explains feature while scrolling phone in hand to match the overlay.\n• 0:24–0:30: Looks back to lens, gives final enthusiastic recommendation.",
      talentAndHandBlocking: "Clear expressive eye direction alternating between the viewer and the floating screen graphic.",
      soundAndAudioCues: "Crisp vocal audio with slight compression. Pop sound effects on each button highlighted on screen.",
      propsAndGear: ["Phone with screen recording prepared", "Ring light", "Microphone"],
      directorExecutionNotes: "Frame the talent strictly in the lower third so their head never clips into the demo graphic."
    }
  },

  // ================= HEALTHY DRINKS UGC =================
  {
    id: "ugc-drink-1",
    title: "Healthy Drinks Reference: Slow-Mo Liquid Pour & Ice Clink",
    section: "ugc-drinks",
    sectionName: "Healthy Drinks UGC",
    categoryTag: "Pour & Splash",
    url: "https://www.instagram.com/reel/DXtO_pUCAYM/",
    platform: "instagram",
    embedId: "DXtO_pUCAYM",
    durationEst: "15s",
    hook: "Cold condensation bottle cap unscrewed with loud hiss, followed by thick colorful juice pouring over ice",
    shootingDirection: {
      cameraPositionAndFraming: "Vertical 9:16. Camera at eye level with transparent glass, 1.5 feet away (50mm lens). Glass fills lower 60% of frame.",
      cameraMovement: "Locked off static on tripod. Shot at 120fps high-frame-rate for slow motion playback.",
      lightingAndSet: "Backlit LED panel through the juice to make the liquid glow translucent, white reflector in front for label fill.",
      actionBreakdown: "• 0:00–0:04: Hand unscrews bottle cap in close-up, mist releases.\n• 0:04–0:10: Continuous slow-mo pour of dark red/orange juice over square ice cubes.\n• 0:10–0:15: Liquid reaches glass rim, ice bobs up, hand places fresh mint sprig on top.",
      talentAndHandBlocking: "Steady hand holds bottle at 45° angle, pouring a smooth uninterrupted stream without splashing out.",
      soundAndAudioCues: "Cap hiss, resonant ice cubes clinking against glass, rich liquid stream sound.",
      propsAndGear: ["Crystal clear glass tumbler", "Dense square ice cubes", "Fresh mint/citrus garnish", "Backlight panel"],
      directorExecutionNotes: "Spray bottle exterior with water/glycerin mix before filming for persistent condensation beads."
    }
  },
  {
    id: "ugc-drink-2",
    title: "Healthy Drinks Reference: Morning Routine Fridge Grab",
    section: "ugc-drinks",
    sectionName: "Healthy Drinks UGC",
    categoryTag: "Lifestyle Routine",
    url: "https://www.instagram.com/reel/DTL5DbdjMVq/",
    platform: "instagram",
    embedId: "DTL5DbdjMVq",
    durationEst: "18s",
    hook: "Camera inside refrigerator looking outward as fridge door swings open and hand grabs cold bottle",
    shootingDirection: {
      cameraPositionAndFraming: "Vertical 9:16. Camera placed inside refrigerator looking out through open door at talent.",
      cameraMovement: "Locked off inside fridge, then cut to handheld kitchen counter shot.",
      lightingAndSet: "Warm kitchen morning sunlight with internal fridge light acting as front key.",
      actionBreakdown: "• 0:00–0:04: Fridge door opens, talent in morning wear reaches in, selects cold juice bottle.\n• 0:04–0:10: Shakes bottle with three firm shakes, walks to counter.\n• 0:10–0:15: Twists cap open, takes satisfying sip, sighs happily.\n• 0:15–0:18: Sets bottle down next to phone on counter.",
      talentAndHandBlocking: "Casual, natural morning movement. Firm grip on bottle while shaking.",
      soundAndAudioCues: "Fridge door suction open, bottle liquid sloshing, cap snap, refreshing sigh.",
      propsAndGear: ["Clean refrigerator", "Chilled juice bottle", "Countertop staging"],
      directorExecutionNotes: "Ensure fridge shelves are completely cleaned and organized to keep visual focus on the bottle."
    }
  },
  {
    id: "ugc-drink-3",
    title: "Healthy Drinks Reference: Aesthetic Wine Goblet Infusion",
    section: "ugc-drinks",
    sectionName: "Healthy Drinks UGC",
    categoryTag: "Artisan Brew",
    url: "https://www.tiktok.com/@sandraleeli/video/7620096838309350669",
    platform: "tiktok",
    embedId: "7620096838309350669",
    durationEst: "15s",
    hook: "Deep crimson hibiscus/zobo stream swirling into a stemmed crystal wine goblet",
    shootingDirection: {
      cameraPositionAndFraming: "Vertical 9:16. Low angle looking slightly up at the stem and bowl of the wine glass (85mm equivalent).",
      cameraMovement: "Slow buttery slow-motion push-in.",
      lightingAndSet: "Moody ambient restaurant/bistro setting. Warm bokeh fairy lights or candle out of focus in background.",
      actionBreakdown: "• 0:00–0:06: Liquid pours in a thin laminar stream into center of goblet, swirling around curved walls.\n• 0:06–0:11: Hand twists dehydrated orange slice and slots onto glass rim.\n• 0:11–0:15: Hand lifts goblet by stem, swirls gently, holds up toward camera.",
      talentAndHandBlocking: "Hold glass strictly by the stem, never by the bowl, to keep glass clean and fingerprint-free.",
      soundAndAudioCues: "Subtle neo-soul instrumental track, quiet liquid stream foley.",
      propsAndGear: ["Stemmed wine goblet", "Dehydrated orange wheel", "Dark artisan beverage"],
      directorExecutionNotes: "Clean the wine glass with glass cleaner and cloth; micro-scratches show up under backlight."
    }
  },
  {
    id: "ugc-drink-4",
    title: "Healthy Drinks Reference: Blender Cup & Glass Straw Slurp",
    section: "ugc-drinks",
    sectionName: "Healthy Drinks UGC",
    categoryTag: "Smoothie UGC",
    url: "https://www.tiktok.com/@thecodiacollective/video/7654757157157539102",
    platform: "tiktok",
    embedId: "7654757157157539102",
    durationEst: "16s",
    hook: "Thick creamy vibrant green/purple smoothie pouring slowly into ribbed glass tumbler",
    shootingDirection: {
      cameraPositionAndFraming: "Vertical 9:16. 45° angle downward on ribbed glass tumbler with glass straw inside.",
      cameraMovement: "Locked off tripod, 1.5 feet away.",
      lightingAndSet: "Bright natural daylight on white marble or light wood kitchen counter.",
      actionBreakdown: "• 0:00–0:05: Thick smoothie pours from blender pitcher, piling up in glass with creamy texture.\n• 0:05–0:10: Pushes reusable glass straw down into smoothie, straw displaces creamy top.\n• 0:10–0:16: Talent takes sip through straw, eyes widen in delight, thumbs up.",
      talentAndHandBlocking: "Slow controlled pour so the thick smoothie texture is clearly visible without overflowing.",
      soundAndAudioCues: "Creamy liquid thud into glass, straw plunging sound, satisfying straw slurp.",
      propsAndGear: ["Ribbed glass tumbler", "Reusable glass straw", "Thick blended smoothie"],
      directorExecutionNotes: "Blend smoothie thick enough to hold texture when poured, not watery."
    }
  },
  {
    id: "ugc-drink-5",
    title: "Healthy Drinks Reference: Daily Wellness Shot Reaction",
    section: "ugc-drinks",
    sectionName: "Healthy Drinks UGC",
    categoryTag: "Wellness Shot",
    url: "https://www.tiktok.com/@tracy.lee.ugc/video/7611708877729582366",
    platform: "tiktok",
    embedId: "7611708877729582366",
    durationEst: "14s",
    hook: "Subject clinks mini 60ml ginger shot bottle against camera lens and downs it in one gulp",
    shootingDirection: {
      cameraPositionAndFraming: "Vertical 9:16 selfie/talking head angle at eye level, 2 feet away.",
      cameraMovement: "Handheld phone or stationary desk mount.",
      lightingAndSet: "Clean ring light or window light directly facing talent.",
      actionBreakdown: "• 0:00–0:03: Holds mini bottle up to lens, clinks bottle rim against camera.\n• 0:03–0:08: Opens mouth, tips bottle fully back, downs entire shot in one continuous gulp.\n• 0:08–0:11: Makes intense funny ginger reaction face, shakes head slightly.\n• 0:11–0:14: Smacks lips, smiles wide, taps chest with pride.",
      talentAndHandBlocking: "Keep the bottle brand label facing outward toward the camera during the entire tip-back motion.",
      soundAndAudioCues: "Bottle clink on lens, audible gulp, comical sound effect on reaction face.",
      propsAndGear: ["Mini glass wellness shot bottle with label", "Ring light"],
      directorExecutionNotes: "Encourage 100% genuine reaction—viewers instantly spot fake grimaces."
    }
  },

  // ================= FOOD / PARFAIT =================
  {
    id: "ugc-food-1",
    title: "Food (Parfait) Reference: Multi-Layer Parfait Spoon Dig ASMR",
    section: "ugc-food",
    sectionName: "Food (Parfait etc)",
    categoryTag: "Parfait Layering ASMR",
    url: "https://www.tiktok.com/@fruitylifengr/video/7510267854172867896?q=%23parfaitUGC&t=1791517774490",
    platform: "tiktok",
    embedId: "7510267854172867896",
    durationEst: "20s",
    hook: "Silver spoon cracks hard through golden granola crust with loud loud crunch sound",
    shootingDirection: {
      cameraPositionAndFraming: "Vertical 9:16. Macro 45° angle. Clear parfait cup fills central 75% of frame. Focus on granola top layer.",
      cameraMovement: "Rock-solid static tripod. Zero camera wobble during the spoon dig.",
      lightingAndSet: "Warm directional key light at 45° left. Specular highlights reflecting off honey and fresh fruit.",
      actionBreakdown: "• 0:00–0:04: 360° slow orbit showing clean layers: yogurt, strawberry puree, granola, kiwi, honey.\n• 0:04–0:09: Silver spoon hovers, then firmly presses down, cracking crispy granola crust.\n• 0:09–0:15: Spoon scoops up a heaped bite with visible layers, lifts up toward camera, honey drips in slow motion.\n• 0:15–0:20: Spoon enters mouth (or frame cuts to satisfied face).",
      talentAndHandBlocking: "Hold spoon by end of handle so hand does not obscure the cup. Move spoon smoothly without shaking.",
      soundAndAudioCues: "Hyper-sensitive ASMR audio: Spoon crack through granola, honey drip, spoon scrape on plastic/glass.",
      propsAndGear: ["Clear layered parfait cup", "Heavy polished silver spoon", "Clip-on lav mic 3 inches from cup"],
      directorExecutionNotes: "Place the microphone 3 to 4 inches from the cup to capture every single crunch decibel."
    }
  },

  // ================= ASMR UGCs - BEVERAGES/DRINKS =================
  {
    id: "ugc-asmr-1",
    title: "ASMR Drinks Reference: Tongs Ice Drop & Soda Fizz Foam",
    section: "ugc-asmr",
    sectionName: "ASMR UGC - Beverages",
    categoryTag: "Ice & Fizz ASMR",
    url: "https://www.tiktok.com/@tracy.lee.ugc/video/7611256825681399071",
    platform: "tiktok",
    embedId: "7611256825681399071",
    durationEst: "15s",
    hook: "Metal tongs drop 3 crystal-clear ice spheres into glass with loud resonant clinks",
    shootingDirection: {
      cameraPositionAndFraming: "Vertical 9:16. Macro eye level. Clear highball glass centered in frame.",
      cameraMovement: "Locked off tripod, 12 inches away.",
      lightingAndSet: "Backlit key light through glass with dark slate or wooden backdrop.",
      actionBreakdown: "• 0:00–0:04: Metal tongs drop ice cube 1, then cube 2, then cube 3 into dry glass.\n• 0:04–0:08: Can tab is cracked open with loud snap.\n• 0:08–0:15: Soda pours down glass wall, fizzing foam rises rapidly to the very top rim.",
      talentAndHandBlocking: "Slow, deliberate hand movements. Drop ice gently so glass does not break.",
      soundAndAudioCues: "Resonant glass chime on each ice drop, metallic can tab pop, crackling carbonation fizz.",
      propsAndGear: ["Clear ice spheres", "Metal ice tongs", "Can/bottle of fizzy beverage", "Lavalier mic close to glass"],
      directorExecutionNotes: "Ensure room is 100% silent (turn off AC/fans) to record pristine ASMR audio."
    }
  },
  {
    id: "ugc-asmr-2",
    title: "ASMR Drinks Reference: Oat Milk Cloud Swirl in Cold Brew",
    section: "ugc-asmr",
    sectionName: "ASMR UGC - Beverages",
    categoryTag: "Swirl & Cream ASMR",
    url: "https://www.tiktok.com/@contentbyclo/video/7617902548363595030",
    platform: "tiktok",
    embedId: "7617902548363595030",
    durationEst: "16s",
    hook: "White cream stream cascades into dark iced coffee, creating billowing marble clouds",
    shootingDirection: {
      cameraPositionAndFraming: "Vertical 9:16. Side view perpendicular to clear cylinder glass filled with dark liquid and ice.",
      cameraMovement: "Static tripod. Zero camera movement—let the fluid dynamics create all visual motion.",
      lightingAndSet: "Clean soft daylight from side window with white bounce board on shadow side.",
      actionBreakdown: "• 0:00–0:04: Glass sits ready with ice and dark liquid.\n• 0:04–0:11: Mini glass pitcher pours white cream in thin constant stream onto an ice cube.\n• 0:11–0:16: White cream billows downward in marble smoke patterns through the dark liquid.",
      talentAndHandBlocking: "Pour from a steady height of 3 inches above the glass without moving the pitcher hand.",
      soundAndAudioCues: "Subtle liquid pour tone, smooth lo-fi ambient track in background.",
      propsAndGear: ["Clear cylindrical glass", "Ice cubes", "Dark beverage (cold brew/tea)", "Mini glass pitcher of cream"],
      directorExecutionNotes: "Do not stir! The natural billowing cloud effect is what viewers re-watch."
    }
  },
  {
    id: "ugc-asmr-3",
    title: "ASMR Drinks Reference: Nail Tapping & Wooden Straw Stir",
    section: "ugc-asmr",
    sectionName: "ASMR UGC - Beverages",
    categoryTag: "Tactile Tapping ASMR",
    url: "https://www.tiktok.com/@sarahugccreator/video/7513992475199950102",
    platform: "tiktok",
    embedId: "7513992475199950102",
    durationEst: "14s",
    hook: "Manicured acrylic nails tap rhythmic pattern on glass: tap-tap-tap, tap-tap",
    shootingDirection: {
      cameraPositionAndFraming: "Vertical 9:16. Close-up on upper third of glass and wooden straw.",
      cameraMovement: "Locked off tripod 1 foot away.",
      lightingAndSet: "Cozy warm ambient lighting.",
      actionBreakdown: "• 0:00–0:04: Two fingernails tap rhythmically on side of glass.\n• 0:04–0:08: Fingers pick up wooden straw, tap straw tip against glass rim twice.\n• 0:08–0:14: Straw plunges through ice, stirs in slow circular motion, ice cubes clink gently.",
      talentAndHandBlocking: "Clean nails, light gentle tap pressure for high-pitch crisp clicks.",
      soundAndAudioCues: "Crisp fingernail clicks on glass, wooden tap, ice swirling rhythm.",
      propsAndGear: ["Glass tumbler with ice", "Wooden/bamboo straw", "Directional microphone"],
      directorExecutionNotes: "Rehearse tapping rhythm once off-camera so it feels musical and intentional."
    }
  },
  {
    id: "ugc-asmr-4",
    title: "ASMR Drinks Reference: High-Speed Citrus Squeeze & Mist",
    section: "ugc-asmr",
    sectionName: "ASMR UGC - Beverages",
    categoryTag: "Fruit Squeeze ASMR",
    url: "https://www.tiktok.com/@lunacreatesugc/video/7391046692847602977",
    platform: "tiktok",
    embedId: "7391046692847602977",
    durationEst: "15s",
    hook: "Cut lime half squeezed firmly with two fingers, sending fine mist and juice droplets into glass",
    shootingDirection: {
      cameraPositionAndFraming: "Vertical 9:16. Macro framing (100mm equivalent) focused directly on the cut citrus half suspended above glass.",
      cameraMovement: "Locked off on tripod at 120fps.",
      lightingAndSet: "Strong side rim light catching airborne mist droplets against a dark background.",
      actionBreakdown: "• 0:00–0:04: Hand holds freshly sliced lime wheel over foaming drink.\n• 0:04–0:10: Fingers squeeze firmly: juice streams down, mist sprays outwards.\n• 0:10–0:15: Squeezed lime half dropped onto ice, splashes gently.",
      talentAndHandBlocking: "Use thumb and first two fingers. Apply firm, steady, continuous squeeze.",
      soundAndAudioCues: "Wet squirt sound, citrus spray hiss, splash into drink.",
      propsAndGear: ["Fresh juicy limes or lemons", "Glass with drink", "Macro lens", "Directional mic"],
      directorExecutionNotes: "Roll citrus on counter with palm before slicing to loosen juice for maximum spray."
    }
  },
  {
    id: "ugc-asmr-5",
    title: "ASMR Drinks Reference: Freshness Foil Peel & Wooden Cap Twist",
    section: "ugc-asmr",
    sectionName: "ASMR UGC - Beverages",
    categoryTag: "Packaging Peel ASMR",
    url: "https://www.tiktok.com/@tiarashyne/video/7319308204972756230",
    platform: "tiktok",
    embedId: "7319308204972756230",
    durationEst: "12s",
    hook: "Fingers peel metallic foil tamper seal off bottle mouth in one continuous tearing motion",
    shootingDirection: {
      cameraPositionAndFraming: "Vertical 9:16. Tight macro 45° angle focused on bottle mouth and seal.",
      cameraMovement: "Locked off on tripod, 8 inches away.",
      lightingAndSet: "Bright tabletop light highlighting the metallic foil reflection.",
      actionBreakdown: "• 0:00–0:03: Wooden cap unscrewed with slow squeak.\n• 0:03–0:08: Fingertip lifts foil tab, pulls smoothly across bottle rim in one clean tear.\n• 0:08–0:12: Foil removed, bottle tipped toward camera showing rich liquid level.",
      talentAndHandBlocking: "Slow, steady peel to avoid jerky tearing.",
      soundAndAudioCues: "Wooden thread squeak, loud crisp foil tearing crackle, air pressure pop.",
      propsAndGear: ["Sealed beverage bottle with foil seal", "Macro lens", "Close microphone"],
      directorExecutionNotes: "Have 2 duplicate sealed bottles on set in case take 1 tears unevenly."
    }
  },

  // ================= BAGS & ACCESSORIES =================
  {
    id: "ugc-bag-1",
    title: "Bags Reference: Leather Quality Slap & Structure Test",
    section: "ugc-bags",
    sectionName: "Bags & Accessories",
    categoryTag: "Leather Structure Test",
    url: "https://www.tiktok.com/@sarahbanks.ugc/video/7618623148195319054?q=bags%20ugc%20content&t=1791501418202",
    platform: "tiktok",
    embedId: "7618623148195319054",
    durationEst: "20s",
    hook: "Open palm slaps taut side of leather handbag with deep solid thud to prove thick grain structure",
    shootingDirection: {
      cameraPositionAndFraming: "Vertical 9:16. Camera at 45° angle, 2.5 feet from bag on pedestal table. Bag centered in frame.",
      cameraMovement: "Slow orbital pan around bag, then punch in on leather grain.",
      lightingAndSet: "Warm raking key light from 45° angle to accentuate natural leather pebbles and grain.",
      actionBreakdown: "• 0:00–0:04: Bag sits on table. Hand enters frame, open palm firmly slaps side of bag twice.\n• 0:04–0:09: Fingers press into leather surface, releasing to show supple memory rebound.\n• 0:09–0:15: Hand runs fingers along top zipper, pulls zipper from left to right in one pull.\n• 0:15–0:20: Bag picked up by top handle, rotated 180°.",
      talentAndHandBlocking: "Confident firm hand actions. No hesitation during the slap test.",
      soundAndAudioCues: "Deep leather thud on slap, smooth zipper glide sound, table thud when set down.",
      propsAndGear: ["Leather tote/handbag", "Display pedestal / wooden table", "Directional mic"],
      directorExecutionNotes: "Ensure bag is stuffed with tissue paper inside so it holds rigid structured shape."
    }
  },
  {
    id: "ugc-bag-2",
    title: "Bags Reference: Small Crossbody 'What Fits Inside' Pack",
    section: "ugc-bags",
    sectionName: "Bags & Accessories",
    categoryTag: "Small Bags / Capacity",
    url: "https://www.tiktok.com/@withlovedaisy_/video/7530444292704242958",
    platform: "tiktok",
    embedId: "7530444292704242958",
    durationEst: "25s",
    hook: "Model points to tiny mini bag: 'You think this can't fit your life? Watch this.'",
    shootingDirection: {
      cameraPositionAndFraming: "Vertical 9:16. Overhead flat lay (70° angle) looking down at bag surrounded by items on table.",
      cameraMovement: "Locked off on overhead rig. Smooth jump-cuts matching each item inserted.",
      lightingAndSet: "Even diffuse lighting with zero harsh shadows. Neutral linen or cream table surface.",
      actionBreakdown: "• 0:00–0:04: Open mini bag sits in center. 6 items arranged in fan around it.\n• 0:04–0:08: Packs phone into back compartment.\n• 0:08–0:12: Packs cardholder and keys into middle pocket.\n• 0:12–0:16: Packs lip oil, mints, sunglasses into front slot.\n• 0:16–0:21: Zips bag completely shut with ease, no bulging.\n• 0:21–0:25: Slings strap over shoulder, steps back.",
      talentAndHandBlocking: "Fast rhythmic packing. Each item placed in one fluid motion without wrestling.",
      soundAndAudioCues: "Item placement clicks, zipper pull, snap closure, energetic beat.",
      propsAndGear: ["Mini crossbody bag", "Daily essentials: Phone, keys, wallet, sunglasses, lip gloss"],
      directorExecutionNotes: "Lay items out in the order they will be packed to avoid talent looking around."
    }
  },
  {
    id: "ugc-bag-3",
    title: "Bags Reference: 1 Bag Styled 3 Ways Fashion Jump Cuts",
    section: "ugc-bags",
    sectionName: "Bags & Accessories",
    categoryTag: "Styling 3 Ways",
    url: "https://www.tiktok.com/@by.rachna/video/7607573075109891346?q=Bagfashionugc&t=1791521136460",
    platform: "tiktok",
    embedId: "7607573075109891346",
    durationEst: "25s",
    hook: "Model snaps fingers, outfit jumps instantly while holding the same bag in same position",
    shootingDirection: {
      cameraPositionAndFraming: "Vertical 9:16. Full body shot, camera 8 feet away at waist height on tripod.",
      cameraMovement: "Locked off on tripod. Absolute identical framing across all 3 takes.",
      lightingAndSet: "Clean neutral wall / entryway with soft natural light.",
      actionBreakdown: "• 0:00–0:08: Outfit 1 (Work): Blazer, trousers. Bag worn on shoulder. Model turns, snaps fingers.\n• 0:08–0:16: Outfit 2 (Casual): Denim, tee. Bag worn crossbody. Model steps forward, snaps fingers.\n• 0:16–0:25: Outfit 3 (Evening): Silk dress. Bag carried as clutch. Model twirls and smiles.",
      talentAndHandBlocking: "Model holds bag in identical spatial position at each jump cut transition point.",
      soundAndAudioCues: "Trending audio with sync snap sound effect on cut transitions.",
      propsAndGear: ["Handbag with detachable strap", "3 outfit changes", "Tape mark on floor for talent feet"],
      directorExecutionNotes: "Mark the floor with gaffer tape for model's shoes so they stand in the exact spot for all 3 takes."
    }
  },
  {
    id: "ugc-bag-4",
    title: "Bags Reference: Close-up Stitching & Brass Rivets Macro Pan",
    section: "ugc-bags",
    sectionName: "Bags & Accessories",
    categoryTag: "Close-up / Hardware",
    url: "https://www.tiktok.com/@princesssss.daily/video/7489433260246928648",
    platform: "tiktok",
    embedId: "7489433260246928648",
    durationEst: "18s",
    hook: "Macro camera glides along precision stitching line with zero flaws or loose threads",
    shootingDirection: {
      cameraPositionAndFraming: "Vertical 9:16. Extreme macro (3 inches away) focused on corner edge seam and brass buckle.",
      cameraMovement: "Ultra-slow motorized pan or slider tracking along seam.",
      lightingAndSet: "Directional side light catching the thread relief and metallic gold gleam.",
      actionBreakdown: "• 0:00–0:06: Continuous pan along perimeter seam.\n• 0:06–0:12: Finger enters frame, traces stitch line gently.\n• 0:12–0:18: Focus shifts to brass buckle, finger flips buckle with satisfying metallic click.",
      talentAndHandBlocking: "Fingertip moves slowly without obscuring the macro focal plane.",
      soundAndAudioCues: "Subtle finger glide sound, metallic buckle snap, quiet ambient drone.",
      propsAndGear: ["Bag with brass hardware", "Macro lens / 3x zoom", "Slider or turntable"],
      directorExecutionNotes: "Use a slowly rotating turntable to achieve smooth 360° pan with zero camera vibration."
    }
  },
  {
    id: "ugc-bag-5",
    title: "Bags Reference: Bag on Bed Morning Unboxing Aesthetic",
    section: "ugc-bags",
    sectionName: "Bags & Accessories",
    categoryTag: "Bag on Bed",
    url: "https://www.tiktok.com/@ugc.ayoushka/video/7475071856685468983",
    platform: "tiktok",
    embedId: "7475071856685468983",
    durationEst: "20s",
    hook: "Hand pulls bag from white cotton dust bag and sets it gently onto textured linen bedsheets",
    shootingDirection: {
      cameraPositionAndFraming: "Vertical 9:16. Top 45° angle looking down onto fluffy white duvet bed.",
      cameraMovement: "Gentle handheld float with subtle organic movement.",
      lightingAndSet: "Warm diffused morning window light streaming across bedsheets.",
      actionBreakdown: "• 0:00–0:05: Hands untie dust bag drawstrings, pull bag out onto white duvet.\n• 0:05–0:11: Hands stroke bag exterior, turn bag around to show back pocket.\n• 0:11–0:16: Unclips shoulder strap from inside, clips both brass hooks onto D-rings.\n• 0:16–0:20: Lifts bag by handle, hovers it above bed, lets it settle into bedding.",
      talentAndHandBlocking: "Gentle, appreciative handling of the product like an admired gift.",
      soundAndAudioCues: "Cotton drawstring rustle, metallic strap clip snaps, soft mattress settle.",
      propsAndGear: ["White/neutral bed linen", "Dust bag", "Handbag with strap"],
      directorExecutionNotes: "Steam or iron the duvet cover so there are no messy wrinkles distracting from the bag."
    }
  },
  {
    id: "ugc-bag-6",
    title: "Bags Reference: Street Walk Low Angle Stride & Sway",
    section: "ugc-bags",
    sectionName: "Bags & Accessories",
    categoryTag: "Street Walk & Movement",
    url: "https://www.tiktok.com/@recos_by_maddy/video/7574338352174927122",
    platform: "tiktok",
    embedId: "7574338352174927122",
    durationEst: "15s",
    hook: "Low angle tracking behind model walking down sunny walkway with bag swaying in natural rhythm",
    shootingDirection: {
      cameraPositionAndFraming: "Vertical 9:16. Low camera angle (knee height) tracking behind and slightly to side of model.",
      cameraMovement: "Gimbal in briefcase mode walking alongside talent at identical stride pace.",
      lightingAndSet: "Outdoor afternoon sunlight with golden rim light on model and bag.",
      actionBreakdown: "• 0:00–0:08: Model strides forward confidently, bag tucked naturally under arm or swinging by handle.\n• 0:08–0:12: Model pauses, pivots slightly to look behind at camera, smiles.\n• 0:12–0:15: Strides out of frame.",
      talentAndHandBlocking: "Natural upright posture, fluid arm swing matching stride rhythm.",
      soundAndAudioCues: "Rhythmic footsteps on stone walkway, upbeat house/fashion track.",
      propsAndGear: ["Gimbal stabilizer", "35mm prime lens", "Chic casual outfit"],
      directorExecutionNotes: "Shoot at 60fps so you have option to slow down the walking stride slightly in edit."
    }
  },
  {
    id: "ugc-bag-7",
    title: "Bags Reference: Quality Breakdown & Price Value Reveal",
    section: "ugc-bags",
    sectionName: "Bags & Accessories",
    categoryTag: "Value & Review",
    url: "https://www.tiktok.com/@seyimii37/video/7555464312966466871",
    platform: "tiktok",
    embedId: "7555464312966466871",
    durationEst: "25s",
    hook: "Creator holds bag next to face: 'People think I paid 200k for this bag... wait till you see'",
    shootingDirection: {
      cameraPositionAndFraming: "Vertical 9:16. Medium close-up on creator, bag held right beside cheek at eye level.",
      cameraMovement: "Locked off tripod at eye level.",
      lightingAndSet: "Ring light or soft key illuminating both face and bag texture evenly.",
      actionBreakdown: "• 0:00–0:05: Creator looks to camera, states price misconception hook.\n• 0:05–0:12: Flips bag around showing stitching, lining, and metal zipper teeth.\n• 0:12–0:18: Opens bag, shows fully lined interior and zip compartment.\n• 0:18–0:25: Reveals actual affordable price with knowing smile.",
      talentAndHandBlocking: "Keep bag steady beside face while talking; do not wave it around rapidly.",
      soundAndAudioCues: "Clear vocal lapel mic, ding sound effect on price graphic text.",
      propsAndGear: ["Handbag", "Ring light", "Wireless lapel mic"],
      directorExecutionNotes: "Keep the bag in sharp focus along with the talent's eyes by using f/4 aperture."
    }
  },
  {
    id: "ugc-bag-8",
    title: "Bags Reference: Thermal Lunch Bag Interior Unpack",
    section: "ugc-bags",
    sectionName: "Bags & Accessories",
    categoryTag: "Lunch Bag / Utility",
    url: "https://www.tiktok.com/@marcusugc/video/7384466469582638379",
    platform: "tiktok",
    embedId: "7384466469582638379",
    durationEst: "22s",
    hook: "Zipper unzips around structured lunch tote, revealing insulated silver foil lining and meal prep bowls",
    shootingDirection: {
      cameraPositionAndFraming: "Vertical 9:16. 45° angle downward on modern office/kitchen counter.",
      cameraMovement: "Locked off tripod, 2 feet away.",
      lightingAndSet: "Clean, modern daylight with bright white reflections off aluminum foil lining.",
      actionBreakdown: "• 0:00–0:05: Unzips double zipper pulls from center outwards.\n• 0:05–0:11: Flips top lid open, pulls out glass container with wood lid, sets on table.\n• 0:11–0:16: Pulls out stainless steel water bottle and fruit container.\n• 0:16–0:22: Hands wipe silver insulated foil interior with cloth to show waterproof wipe-clean feature.",
      talentAndHandBlocking: "Smooth, organized extraction of containers.",
      soundAndAudioCues: "Double zipper pull, glass container clink on table, foil crinkle.",
      propsAndGear: ["Insulated lunch tote", "Meal prep containers", "Damp cloth"],
      directorExecutionNotes: "Clean the glass containers so food looks appetizing and fresh."
    }
  },
  {
    id: "ugc-bag-9",
    title: "Bags Reference: Minimalist Neutral Aesthetic Draft",
    section: "ugc-bags",
    sectionName: "Bags & Accessories",
    categoryTag: "Minimalist Aesthetic",
    url: "https://www.tiktok.com/@aestheticdrafts24/video/7473189993628863766",
    platform: "tiktok",
    embedId: "7473189993628863766",
    durationEst: "15s",
    hook: "Slow atmospheric push-in on quiet luxury handbag sitting on concrete ledge with shadow cast",
    shootingDirection: {
      cameraPositionAndFraming: "Vertical 9:16. Eye level 50mm lens. Bag sitting on minimalist concrete or marble surface.",
      cameraMovement: "Slow deliberate push-in (slider or gimbal) at 24fps cinematic shutter.",
      lightingAndSet: "Warm directional sunlight creating distinct architectural shadow lines across wall behind bag.",
      actionBreakdown: "• 0:00–0:06: Pure product hero shot as light shifts across silhouette.\n• 0:06–0:11: Elegant hand enters frame, lifts bag gently by top handle.\n• 0:11–0:15: Hand carries bag smoothly out of frame.",
      talentAndHandBlocking: "Slow, serene movement. Fingertips curl naturally around handle.",
      soundAndAudioCues: "Ambient piano melody with gentle room reverb.",
      propsAndGear: ["Minimalist silhouette bag", "Architectural concrete/stone surface"],
      directorExecutionNotes: "Keep the composition clean with zero distracting background elements."
    }
  },
  {
    id: "ugc-bag-10",
    title: "Bags Reference: Mini Backpack Daily Commute Packing",
    section: "ugc-bags",
    sectionName: "Bags & Accessories",
    categoryTag: "Backpack UGC",
    url: "https://www.tiktok.com/@angelacreatesugc/video/7662531728744975646?q=%23bagpackugc&t=1791516790450",
    platform: "tiktok",
    embedId: "7662531728744975646",
    durationEst: "20s",
    hook: "Hands pack tablet, headphones, and daily items into compact leather backpack with multi-pocket layout",
    shootingDirection: {
      cameraPositionAndFraming: "Vertical 9:16. 45° angle on desk. Backpack sits upright.",
      cameraMovement: "Static with fast punch-in cuts.",
      lightingAndSet: "Bright desk lamp + soft daylight.",
      actionBreakdown: "• 0:00–0:05: Slides iPad/tablet into padded interior rear sleeve.\n• 0:05–0:09: Places headphones and power bank into main compartment, pulls main zipper.\n• 0:09–0:14: Unzips front exterior pocket, drops keys and lip balm, zips shut.\n• 0:14–0:20: Swings backpack onto one shoulder with quick fluid motion.",
      talentAndHandBlocking: "Quick efficient packing motions.",
      soundAndAudioCues: "Zipper zips, magnetic snap, fabric pull.",
      propsAndGear: ["Mini leather backpack", "Tablet, headphones, accessories"],
      directorExecutionNotes: "Demonstrate that the main zipper closes smoothly without snagging on the tablet."
    }
  },
  {
    id: "ugc-bag-11",
    title: "Bags Reference: Backpack Water Spray & Durability Test",
    section: "ugc-bags",
    sectionName: "Bags & Accessories",
    categoryTag: "Backpack Durability Test",
    url: "https://www.tiktok.com/@tessavkersbergen/video/7347272390218353953?q=%23bagpackugc&t=1791516790450",
    platform: "tiktok",
    embedId: "7347272390218353953",
    durationEst: "22s",
    hook: "Water spray bottle sprays heavy mist directly onto backpack fabric; water beads up and rolls off",
    shootingDirection: {
      cameraPositionAndFraming: "Vertical 9:16. Macro 45° angle focused on backpack front panel.",
      cameraMovement: "Locked off on tripod, 1.5 feet away.",
      lightingAndSet: "Direct side light making water droplets glisten on surface.",
      actionBreakdown: "• 0:00–0:06: Spray bottle sprays 4 heavy pumps directly onto fabric.\n• 0:06–0:12: Close-up shows water droplets beading and rolling down without soaking.\n• 0:12–0:17: Dry hand wipes drops off with one sweep; fabric beneath is dry.\n• 0:17–0:22: Unzips pocket, pulls out a dry paper napkin to prove 100% interior dryness.",
      talentAndHandBlocking: "Firm pumps of spray bottle, clean wipe gesture.",
      soundAndAudioCues: "Water spritz sound, wipe sound, zipper pull, crinkle of dry napkin.",
      propsAndGear: ["Backpack", "Spray bottle filled with water", "Dry paper napkin"],
      directorExecutionNotes: "Pull the dry napkin out of the pocket on camera in the same continuous take to prove authenticity."
    }
  },
  {
    id: "ugc-bag-12",
    title: "Bags Reference: Everyday Crossbody Fit & Strap Check",
    section: "ugc-bags",
    sectionName: "Bags & Accessories",
    categoryTag: "Everyday Crossbody",
    url: "https://www.tiktok.com/@valeriia.dutchak11/video/7284986985939258629",
    platform: "tiktok",
    embedId: "7284986985939258629",
    durationEst: "16s",
    hook: "Model adjusts wide guitar strap across chest and taps quick-access magnetic phone pocket",
    shootingDirection: {
      cameraPositionAndFraming: "Vertical 9:16. Medium shot from waist up.",
      cameraMovement: "Gimbal tracking with model pivoting 180°.",
      lightingAndSet: "Warm bright interior room.",
      actionBreakdown: "• 0:00–0:05: Model puts strap over shoulder, slides buckle to adjust strap length.\n• 0:05–0:10: Pulls phone effortlessly from exterior magnetic pocket, checks it, slides it back.\n• 0:10–0:16: Turns side-to-side showing slim profile against body.",
      talentAndHandBlocking: "Smooth slide of phone in and out of pocket with one hand.",
      soundAndAudioCues: "Magnetic pocket snap click, strap buckle glide.",
      propsAndGear: ["Crossbody bag with wide adjustable strap", "Smartphone"],
      directorExecutionNotes: "Highlight the strap comfort and padding across the shoulder."
    }
  },
  {
    id: "ugc-bag-13",
    title: "Bags Reference: Laptop Bag Sleeve Slide & Hardware Latch",
    section: "ugc-bags",
    sectionName: "Bags & Accessories",
    categoryTag: "Laptop Bag / Executive",
    url: "https://www.tiktok.com/@mrsuitcaseug/video/7276720440796564769?q=%23laptopbagugc&t=1791520618259",
    platform: "tiktok",
    embedId: "7276720440796564769",
    durationEst: "24s",
    hook: "16-inch laptop slides smoothly into padded leather sleeve, followed by solid brass lock click",
    shootingDirection: {
      cameraPositionAndFraming: "Vertical 9:16. 45° angle on clean wooden desk.",
      cameraMovement: "Locked off static on tripod.",
      lightingAndSet: "Corporate executive aesthetic: Warm wood, leather desk mat, subtle office lamp.",
      actionBreakdown: "• 0:00–0:06: Unlatches front brass lock with satisfying snap, opens leather flap.\n• 0:06–0:13: Holds laptop with two hands, slides it into velvet-padded compartment.\n• 0:13–0:18: Slots notebook and pen into dedicated side sleeves.\n• 0:18–0:24: Closes flap, pushes brass lock down until it clicks shut, picks up by handle.",
      talentAndHandBlocking: "Controlled, professional executive hand movements.",
      soundAndAudioCues: "Heavy metallic latch click, laptop sliding against velvet padding, leather handle creak.",
      propsAndGear: ["Leather briefcase / laptop bag", "Laptop", "Notebook and luxury pen"],
      directorExecutionNotes: "Ensure the brass latch clicks loudly—record this sound effect clean on set."
    }
  },
  {
    id: "ugc-bag-14",
    title: "Bags Reference: Ankara Print Fabric Pattern & Pocket Texture",
    section: "ugc-bags",
    sectionName: "Bags & Accessories",
    categoryTag: "Ankara Print Laptop Bag",
    url: "https://www.tiktok.com/@ankaraartifacts/video/7467143572521864453?q=%23laptopbagugc&t=1791520618259",
    platform: "tiktok",
    embedId: "7467143572521864453",
    durationEst: "20s",
    hook: "Hand sweeps across vivid Ankara wax print pattern, showing reinforced leather handles and padding",
    shootingDirection: {
      cameraPositionAndFraming: "Vertical 9:16. Eye level 45° angle on display table. Bag fills central frame.",
      cameraMovement: "Slow tracking push-in with macro focus on wax print pattern.",
      lightingAndSet: "Vibrant high-CRI lighting to make the bold African print colors (yellows, blues, oranges) pop vividly.",
      actionBreakdown: "• 0:00–0:05: Hand sweeps across print texture, showcasing pattern alignment across seams.\n• 0:05–0:10: Lifts leather handles, demonstrates double-stitched reinforcement.\n• 0:10–0:15: Unzips bag, presses finger into foam padding inside to show protective thickness.\n• 0:15–0:20: Slides laptop inside, zips shut.",
      talentAndHandBlocking: "Slow, deliberate hand sweeps highlighting print details.",
      soundAndAudioCues: "Fabric brush sound, sturdy zipper pull, upbeat Afrobeat percussion.",
      propsAndGear: ["Ankara print laptop bag", "Laptop", "High-CRI light panel"],
      directorExecutionNotes: "Calibrate camera white balance carefully so fabric colors are accurate and vibrant."
    }
  },
  {
    id: "ugc-bag-15",
    title: "Bags Reference: Matching Ankara 3-Piece Set Fan-Out",
    section: "ugc-bags",
    sectionName: "Bags & Accessories",
    categoryTag: "Ankara Coordinated Set",
    url: "https://www.tiktok.com/@ankaraartifacts/video/7671747865194155284",
    platform: "tiktok",
    embedId: "7671747865194155284",
    durationEst: "20s",
    hook: "Hands place matching laptop bag, tote, and pouch one by one in perfect symmetrical layout",
    shootingDirection: {
      cameraPositionAndFraming: "Vertical 9:16. Strict overhead top-down flat lay (90°).",
      cameraMovement: "Locked off on overhead boom arm.",
      lightingAndSet: "Even shadowless flat-lay lighting.",
      actionBreakdown: "• 0:00–0:05: Empty white table. Hands place large laptop bag in center.\n• 0:05–0:10: Places matching tote bag on left with identical pattern orientation.\n• 0:10–0:15: Places small cosmetic/pencil pouch on right.\n• 0:15–0:20: Hands frame the set from outside, finger taps pouch twice.",
      talentAndHandBlocking: "Symmetrical placement with 1-inch even spacing between all 3 pieces.",
      soundAndAudioCues: "Fabric thud on table, zipper glide, upbeat sync music beat.",
      propsAndGear: ["3 matching Ankara print pieces", "White/light wood flat-lay table", "Overhead mount"],
      directorExecutionNotes: "Ensure all print patterns are right-side-up and facing the camera consistently."
    }
  },

  // ================= SHOES & FOOTWEAR =================
  {
    id: "ugc-shoe-1",
    title: "Shoes Reference: Leather Loafers Ground-Level Walk & Crease Test",
    section: "ugc-shoes",
    sectionName: "Shoes & Footwear",
    categoryTag: "Loafers & Dress Shoes",
    url: "https://www.tiktok.com/@anniekugc/video/7617121964045454625",
    platform: "tiktok",
    embedId: "7617121964045454625",
    durationEst: "22s",
    hook: "Camera 2 inches from pavement as leather loafers walk in stride, then bend at toe without cracking",
    shootingDirection: {
      cameraPositionAndFraming: "Vertical 9:16. Ground-level low angle (lens 2–3 inches above walkway) tracking footfalls.",
      cameraMovement: "Low-mode gimbal tracking backward as talent walks forward in steady stride.",
      lightingAndSet: "Late afternoon directional sunlight casting sharp long shoe shadows on paved tiles.",
      actionBreakdown: "• 0:00–0:08: Feet walk in confident forward stride toward camera.\n• 0:08–0:14: Right foot pauses, model flexes ball of foot 45° to demonstrate leather supple crease bounce-back.\n• 0:14–0:22: Model rotates ankle 360°, taps heel once on stone, walks forward past camera.",
      talentAndHandBlocking: "Tailored trousers hemmed just above ankle to showcase entire shoe silhouette.",
      soundAndAudioCues: "Crisp wooden/leather heel clicks on stone, supple leather flex sound.",
      propsAndGear: ["Handcrafted leather loafers", "Low gimbal rig", "Tailored ankle-length trousers"],
      directorExecutionNotes: "Ensure shoes are polished to high shine before rolling ground-level macro."
    }
  },
  {
    id: "ugc-shoe-2",
    title: "Shoes Reference: Sneaker Foam Insole Thumb Press & Rebound",
    section: "ugc-shoes",
    sectionName: "Shoes & Footwear",
    categoryTag: "Sneakers / Insole Cushion",
    url: "https://www.tiktok.com/@raghad_ugc/video/7396073349157326098",
    platform: "tiktok",
    embedId: "7396073349157326098",
    durationEst: "18s",
    hook: "Two thumbs press deeply into sneaker insole foam; foam rebounds instantly without denting",
    shootingDirection: {
      cameraPositionAndFraming: "Vertical 9:16. Macro 45° angle looking into shoe collar and insole.",
      cameraMovement: "Locked off tripod, 10 inches away.",
      lightingAndSet: "Clean white studio tabletop with soft front lighting.",
      actionBreakdown: "• 0:00–0:04: Two hands hold sneaker, bend sneaker into U-shape to show flexibility.\n• 0:04–0:10: Pulls insole halfway out, two thumbs press hard into heel cushion, releases to show rebound.\n• 0:10–0:18: Slips insole back, taps shoe outsole on table twice.",
      talentAndHandBlocking: "Firm, strong thumb press showing maximum compression.",
      soundAndAudioCues: "Rubber flex sound, soft cushion squish, double table tap.",
      propsAndGear: ["Sneakers with removable insole", "Clean white background"],
      directorExecutionNotes: "Clean white rubber outsole with alcohol wipe so it looks fresh out of the box."
    }
  },
  {
    id: "ugc-shoe-3",
    title: "Shoes Reference: First-Person POV Shoe Slip-On & Lace Tie",
    section: "ugc-shoes",
    sectionName: "Shoes & Footwear",
    categoryTag: "POV Slip-On",
    url: "https://www.tiktok.com/@sedona.pov/video/7252722980625861934",
    platform: "tiktok",
    embedId: "7252722980625861934",
    durationEst: "20s",
    hook: "Looking down from eyes at own feet sliding smoothly into brand new shoes on hardwood floor",
    shootingDirection: {
      cameraPositionAndFraming: "Vertical 9:16 first-person POV looking down at 60° angle at talent's feet.",
      cameraMovement: "Chest mount or hands holding phone at chest height.",
      lightingAndSet: "Warm domestic rug / hardwood floor setting with morning sunlight.",
      actionBreakdown: "• 0:00–0:05: Right foot slides smoothly into open shoe collar; heel clicks snugly into counter.\n• 0:05–0:12: Hands enter frame from sides, pull laces taut, tie symmetrical bow in one fluid motion.\n• 0:12–0:20: Talent stands up, steps forward onto hardwood floor, taps toe.",
      talentAndHandBlocking: "Fluid lace-tying motion with no fumbling.",
      soundAndAudioCues: "Foot sliding into leather/fabric, lace pull snap, footstep on wood.",
      propsAndGear: ["Chest mount / phone", "Shoes", "Socks matching pant color"],
      directorExecutionNotes: "Ensure socks are clean, matching, and styled properly with the pant break."
    }
  },
  {
    id: "ugc-shoe-4",
    title: "Shoes Reference: High Heel Runway Pivot & Stiletto Tap",
    section: "ugc-shoes",
    sectionName: "Shoes & Footwear",
    categoryTag: "Women's Heels / Runway",
    url: "https://www.tiktok.com/@wela.ugc/video/7642800062296444168",
    platform: "tiktok",
    embedId: "7642800062296444168",
    durationEst: "18s",
    hook: "Stiletto heel clicks sharply on polished marble floor, followed by slow 360° pivot turn",
    shootingDirection: {
      cameraPositionAndFraming: "Vertical 9:16. Low angle slow motion (60fps) tracking tilt up from heel to ankle.",
      cameraMovement: "Gimbal on low mode slowly tilting up as model walks.",
      lightingAndSet: "Polished reflective marble floor reflecting overhead chandelier / soft key.",
      actionBreakdown: "• 0:00–0:06: Model takes 3 slow elegant strides toward camera.\n• 0:06–0:12: Pauses, pivots 180° on ball of right foot, showing heel arch and straps.\n• 0:12–0:18: Taps heel twice on floor, glides forward away from camera.",
      talentAndHandBlocking: "Confident, graceful runway walk. Straight ankles with no wobbling.",
      soundAndAudioCues: "Sharp, resonant stiletto heel click on marble, trending elegant runway audio.",
      propsAndGear: ["High heel shoes", "Polished floor surface", "Low angle gimbal"],
      directorExecutionNotes: "Clean the floor tile so the mirror reflection of the shoe is crystal clear."
    }
  },
  {
    id: "ugc-shoe-5",
    title: "Shoes Reference: Welt Stitch & Sole Tread Durability Flex",
    section: "ugc-shoes",
    sectionName: "Shoes & Footwear",
    categoryTag: "Construction & Grip",
    url: "https://www.tiktok.com/@yry.ugc/video/7516955502148848918",
    platform: "tiktok",
    embedId: "7516955502148848918",
    durationEst: "20s",
    hook: "Close-up macro pan along heavy Goodyear welt sole stitching and dense rubber lug tread",
    shootingDirection: {
      cameraPositionAndFraming: "Vertical 9:16. Macro side-view tracking along welt stitch edge.",
      cameraMovement: "Locked off static with hands manipulating shoe in frame.",
      lightingAndSet: "Direct sharp side lighting revealing depth of thread channel.",
      actionBreakdown: "• 0:00–0:06: Two hands hold shoe inverted, showing dense rubber tread pattern.\n• 0:06–0:12: Fingernail runs firmly across tread lugs, showing thick rubber density.\n• 0:12–0:20: Flips shoe to side profile, traces welt stitching from heel to toe box.",
      talentAndHandBlocking: "Hold shoe firmly with both hands, rotating slowly for macro focus.",
      soundAndAudioCues: "Rubber flex creak, fingernail scrape across tread, solid table thud.",
      propsAndGear: ["Handcrafted shoe with welt stitch", "Macro lens", "Directional light"],
      directorExecutionNotes: "Keep the sole completely clean of dust or outdoor dirt before shooting the tread."
    }
  },
  {
    id: "ugc-shoe-6",
    title: "Shoes Reference: Trousers to Shoes Break Styling Jump Cuts",
    section: "ugc-shoes",
    sectionName: "Shoes & Footwear",
    categoryTag: "Styling & Break Ratio",
    url: "https://www.tiktok.com/@kathlyn.ugc/video/7617962258664115469",
    platform: "tiktok",
    embedId: "7617962258664115469",
    durationEst: "20s",
    hook: "Knee-down framing: Jump cut transitions between 3 different trouser cuts with same shoes",
    shootingDirection: {
      cameraPositionAndFraming: "Vertical 9:16. Knee-down framing (lens 2 feet off floor, 5 feet away on tripod).",
      cameraMovement: "Locked off on tripod. Exact same camera position for all 3 trouser changes.",
      lightingAndSet: "Even studio lighting on neutral floor.",
      actionBreakdown: "• 0:00–0:06: Look 1: Cropped tailored trousers (no break). Model shifts weight left to right.\n• 0:06–0:13: Jump cut to Look 2: Wide-leg puddle denim (half break). Model turns side profile.\n• 0:13–0:20: Jump cut to Look 3: Linen drawstring trouser (light break). Model walks forward.",
      talentAndHandBlocking: "Stand on exact tape mark on floor across all 3 takes for seamless alignment.",
      soundAndAudioCues: "Sync jump cuts with beat drops / snare hits on trending audio.",
      propsAndGear: ["1 pair of shoes", "3 pairs of trousers", "Floor tape marks"],
      directorExecutionNotes: "Ensure model's feet don't move from the taped X when changing pants."
    }
  },
  {
    id: "ugc-shoe-7",
    title: "Shoes Reference: Luxury Shoe Box & Velvet Dust Bag Reveal",
    section: "ugc-shoes",
    sectionName: "Shoes & Footwear",
    categoryTag: "Packaging Unbox",
    url: "https://www.tiktok.com/@es_ugc/video/7476408164397698312",
    platform: "tiktok",
    embedId: "7476408164397698312",
    durationEst: "18s",
    hook: "Rigid textured shoe box lid lifted slowly with smooth slide, revealing embossed tissue paper",
    shootingDirection: {
      cameraPositionAndFraming: "Vertical 9:16. 45° angle looking down at shoe box on dark wooden table.",
      cameraMovement: "Locked off static on tripod.",
      lightingAndSet: "Warm moody editorial lighting with subtle backlight.",
      actionBreakdown: "• 0:00–0:05: Hands lift heavy rigid lid slowly, set lid beside box.\n• 0:05–0:10: Pulls back printed tissue paper, pulls out individual velvet dust bag.\n• 0:10–0:18: Slides burnished leather shoe out of dust bag, sets it on top of box.",
      talentAndHandBlocking: "Deliberate luxury unboxing pace. Handle shoes with care.",
      soundAndAudioCues: "Box lid suction slide, tissue crinkle, soft velvet draw, table settle thud.",
      propsAndGear: ["Rigid shoe box", "Velvet dust bag", "Handmade shoes", "Clean wooden table"],
      directorExecutionNotes: "Use white cotton gloves on talent if you want an ultra-luxury archival unboxing feel."
    }
  },
  {
    id: "ugc-shoe-8",
    title: "Shoes Reference: Horsehair Brush Buffing & Toe Cap Shine ASMR",
    section: "ugc-shoes",
    sectionName: "Shoes & Footwear",
    categoryTag: "Shoe Polish & Shine ASMR",
    url: "https://www.tiktok.com/@madeby.nida/video/7629022112954633490",
    platform: "tiktok",
    embedId: "7629022112954633490",
    durationEst: "15s",
    hook: "Rapid rhythmic sweeping of horsehair brush across leather toe cap, bringing out mirror shine",
    shootingDirection: {
      cameraPositionAndFraming: "Vertical 9:16. Macro close-up on shoe toe cap and brush bristles.",
      cameraMovement: "Locked off on tripod, 8 inches away.",
      lightingAndSet: "Direct point light reflecting like a star on the buffed leather toe cap.",
      actionBreakdown: "• 0:00–0:07: Fast rhythmic back-and-forth strokes with wooden horsehair brush.\n• 0:07–0:11: Hand switches to soft microfiber cloth, buffs toe cap with circular friction.\n• 0:11–0:15: Holds shoe up: light reflects clearly off mirror shine.",
      talentAndHandBlocking: "Fast, rhythmic, confident wrist movement while brushing.",
      soundAndAudioCues: "Loud rhythmic brush bristles sweeping against leather, squeak of cloth friction.",
      propsAndGear: ["Horsehair shoe brush", "Shoe polish / wax", "Microfiber cloth", "Dress shoe"],
      directorExecutionNotes: "Apply a single tiny drop of water on toe cap before the cloth buff for glass-like reflection."
    }
  },
  {
    id: "ugc-shoe-9",
    title: "Shoes Reference: Men's Agbada Hem Lift & Half-Shoe Stride",
    section: "ugc-shoes",
    sectionName: "Shoes & Footwear",
    categoryTag: "Men's Traditional Half-Shoes",
    url: "https://www.tiktok.com/@ugcbytrabb/video/7334075760673639723",
    platform: "tiktok",
    embedId: "7334075760673639723",
    durationEst: "22s",
    hook: "Man adjusts crisp embroidered Agbada sleeve, steps forward showing sleek leather mules/half-shoes",
    shootingDirection: {
      cameraPositionAndFraming: "Vertical 9:16. Low to medium tracking shot moving backward ahead of talent.",
      cameraMovement: "Gimbal stabilizer tracking at walking pace.",
      lightingAndSet: "Warm golden outdoor sunlight illuminating embroidered white/cream fabric.",
      actionBreakdown: "• 0:00–0:06: Full length shot: Man flips Agbada shoulder fold over arm with regal poise.\n• 0:06–0:14: Camera dips low to feet as he strides forward in slip-on half-shoes.\n• 0:14–0:22: Model pauses, crosses one foot slightly, adjusts wrist watch, smiles into camera.",
      talentAndHandBlocking: "Regal, confident posture. Smooth traditional shoulder fold motion.",
      soundAndAudioCues: "Heavy fabric billowing rustle, leather shoe click, modern African fusion beat.",
      propsAndGear: ["Embroidered Agbada", "Handcrafted leather half-shoes / mules", "Wristwatch"],
      directorExecutionNotes: "Capture the fabric billowing in slow motion (60fps) as he takes the first stride."
    }
  },
  {
    id: "ugc-shoe-10",
    title: "Shoes Reference: Casual Walking Outdoor Stairs & Flexibility",
    section: "ugc-shoes",
    sectionName: "Shoes & Footwear",
    categoryTag: "Casual Walking / Unisex",
    url: "https://www.tiktok.com/@somosanayalvaro/video/7599756225227607318",
    platform: "tiktok",
    embedId: "7599756225227607318",
    durationEst: "20s",
    hook: "Feet walking briskly down outdoor stone staircase showing shock absorption and heel support",
    shootingDirection: {
      cameraPositionAndFraming: "Vertical 9:16. Low angle tracking alongside talent on staircase.",
      cameraMovement: "Gimbal tracking down stairs beside subject.",
      lightingAndSet: "Natural outdoor daylight.",
      actionBreakdown: "• 0:00–0:08: Feet walk down 6 steps naturally without looking down.\n• 0:08–0:14: Transitions onto flat walkway, takes 4 brisk strides.\n• 0:14–0:20: Kicks one foot up backward showing sole tread, turns to smile.",
      talentAndHandBlocking: "Relaxed casual walking posture.",
      soundAndAudioCues: "Firm rubber steps on stone stairs, upbeat positive vlog audio.",
      propsAndGear: ["Casual slip-on footwear", "Outdoor staircase location", "Gimbal"],
      directorExecutionNotes: "Operator must watch footing while tracking down stairs backwards."
    }
  },
  {
    id: "ugc-shoe-11",
    title: "Shoes Reference: Foot Measurement Tape to Insole Sizing",
    section: "ugc-shoes",
    sectionName: "Shoes & Footwear",
    categoryTag: "Sizing & Fit Guide",
    url: "https://www.tiktok.com/@zuzana.ugc/video/7441513254695734550",
    platform: "tiktok",
    embedId: "7441513254695734550",
    durationEst: "24s",
    hook: "Measuring tape snaps against heel-to-toe line on white paper showing exact centimeter fit",
    shootingDirection: {
      cameraPositionAndFraming: "Vertical 9:16. Overhead flat lay on floor looking down at barefoot on white paper.",
      cameraMovement: "Locked off static on tripod.",
      lightingAndSet: "Bright shadowless light on floor.",
      actionBreakdown: "• 0:00–0:06: Bare foot steps on paper, pencil marks heel and longest toe.\n• 0:06–0:12: Yellow measuring tape measures distance: 26.5 cm.\n• 0:12–0:18: Shows shoe insole placed directly over paper marks: matches exactly.\n• 0:18–0:24: Slips foot into shoe: shows perfect zero-gap fit.",
      talentAndHandBlocking: "Clear steady pencil marking and tape measurement.",
      soundAndAudioCues: "Pencil on paper scratch, measuring tape snap, shoe slip sound.",
      propsAndGear: ["Measuring tape", "Sheet of paper, pencil", "Shoes with removable insole"],
      directorExecutionNotes: "Keep the measurement numbers clearly legible under camera focus."
    }
  },
  {
    id: "ugc-shoe-12",
    title: "Shoes Reference: Suede Clogs Ankle Rotation & Sock Fit",
    section: "ugc-shoes",
    sectionName: "Shoes & Footwear",
    categoryTag: "Clogs & Mules UGC",
    url: "https://www.tiktok.com/@tomarden1/video/7662747941127441667",
    platform: "tiktok",
    embedId: "7662747941127441667",
    durationEst: "18s",
    hook: "Feet in chunky ribbed cream socks slip effortlessly into brown suede buckle clogs",
    shootingDirection: {
      cameraPositionAndFraming: "Vertical 9:16. Top 45° angle on cozy rug or wooden floor.",
      cameraMovement: "Locked off static on tripod.",
      lightingAndSet: "Warm cozy golden hour window light.",
      actionBreakdown: "• 0:00–0:05: Feet in chunky socks slide into suede clogs without hands.\n• 0:05–0:10: Rotates right ankle outward, showing brass buckle and suede nap texture.\n• 0:10–0:18: Stands up, wide-leg trousers drape over clog collar, takes 2 relaxed steps.",
      talentAndHandBlocking: "Hands-free entry to showcase slip-on convenience.",
      soundAndAudioCues: "Soft cork sole step on rug, cozy indie acoustic soundtrack.",
      propsAndGear: ["Suede buckle clogs", "Chunky ribbed cream socks", "Wide-leg pants"],
      directorExecutionNotes: "Pair suede clogs with cream or oatmeal socks for maximum aesthetic contrast."
    }
  },

  // ================= SLIPPERS & SLIDES =================
  {
    id: "ugc-slipper-1",
    title: "Slippers Reference: Minimalist Double-Strap Slide & Step Out",
    section: "ugc-slippers",
    sectionName: "Slippers & Slides",
    categoryTag: "Leather Slides",
    url: "https://www.tiktok.com/@itsamisugc/video/7645438176810536214",
    platform: "tiktok",
    embedId: "7645438176810536214",
    durationEst: "16s",
    hook: "Feet step out of door threshold directly into double-strap leather slides in one motion",
    shootingDirection: {
      cameraPositionAndFraming: "Vertical 9:16. Low angle tracking feet stepping from indoor doorway to sunlit outdoor porch.",
      cameraMovement: "Low gimbal tracking alongside feet.",
      lightingAndSet: "Contrast between cool indoor doorway and warm sunny outdoor porch.",
      actionBreakdown: "• 0:00–0:05: Feet slide into double-strap leather slides sitting at doorway.\n• 0:05–0:10: Steps outside onto sunny porch, walking smoothly with no slapping sound.\n• 0:10–0:16: Pauses in sunlight, turns foot side-to-side showing leather strap finish.",
      talentAndHandBlocking: "Clean, well-groomed feet. Smooth glide without heel dragging.",
      soundAndAudioCues: "Soft footstep on stone, door closing gently, acoustic guitar.",
      propsAndGear: ["Leather slides", "Doorway / porch setting"],
      directorExecutionNotes: "Ensure feet are moisturized and nails neat before filming close-up foot shots."
    }
  },
  {
    id: "ugc-slipper-2",
    title: "Slippers Reference: Cloud Cushion Drop Bounce Test",
    section: "ugc-slippers",
    sectionName: "Slippers & Slides",
    categoryTag: "Cloud Slides Bounce",
    url: "https://www.tiktok.com/@pinkmoodzugc1/video/7666623810988182802",
    platform: "tiktok",
    embedId: "7666623810988182802",
    durationEst: "15s",
    hook: "Dropping a ball/egg directly onto thick cloud slipper sole in 120fps slow-mo to show shock rebound",
    shootingDirection: {
      cameraPositionAndFraming: "Vertical 9:16. Ground-level horizontal macro on 4cm-thick cloud slipper sole.",
      cameraMovement: "Locked off tripod at 120fps high-speed capture.",
      lightingAndSet: "Bright studio lighting illuminating the foam texture.",
      actionBreakdown: "• 0:00–0:05: Hand holds ball 2 feet above thick slipper footbed.\n• 0:05–0:10: Drops ball: ball impacts foam, foam compresses 50% and rebounds ball gently.\n• 0:10–0:15: Hand pinches 4cm thick sole between thumb and fingers to show squishy density.",
      talentAndHandBlocking: "Clean drop directly onto the heel strike zone of the slipper.",
      soundAndAudioCues: "Soft rubber thud, springy bounce sound effect, finger squish sound.",
      propsAndGear: ["Super-thick cloud slides", "Bouncy ball or hard-boiled egg", "Macro lens"],
      directorExecutionNotes: "Drop the ball directly in the center of the heel cup for a clean vertical bounce."
    }
  },
  {
    id: "ugc-slipper-3",
    title: "Slippers Reference: Poolside Splash & Waterproof Runoff",
    section: "ugc-slippers",
    sectionName: "Slippers & Slides",
    categoryTag: "Waterproof Resort Slides",
    url: "https://www.tiktok.com/@shots.by.salma/video/7667257424537193736",
    platform: "tiktok",
    embedId: "7667257424537193736",
    durationEst: "18s",
    hook: "Feet wearing waterproof slides step through pool edge puddle; water beads off instantly",
    shootingDirection: {
      cameraPositionAndFraming: "Vertical 9:16. Low angle tracking alongside poolside water edge.",
      cameraMovement: "Low gimbal tracking feet walking through shallow water splash.",
      lightingAndSet: "Bright outdoor midday sunlight with shimmering water reflections.",
      actionBreakdown: "• 0:00–0:06: Steps through shallow pool ledge puddle; water splashes outwards in slow-mo.\n• 0:06–0:12: Steps onto dry deck: water immediately sheets off slide straps leaving them dry.\n• 0:12–0:18: Taps toe twice on pool deck, walks away.",
      talentAndHandBlocking: "Confident wet-surface walking with no slipping.",
      soundAndAudioCues: "Water splash, footsteps on wet tile, summer upbeat beat.",
      propsAndGear: ["Waterproof resort slides", "Poolside or outdoor water area"],
      directorExecutionNotes: "Shoot at 60fps or 120fps to capture individual airborne water droplets in slow motion."
    }
  },
  {
    id: "ugc-slipper-4",
    title: "Slippers Reference: Hand-Beaded Artisan Slipper Sparkle Tilt",
    section: "ugc-slippers",
    sectionName: "Slippers & Slides",
    categoryTag: "Beaded Artisan Slippers",
    url: "https://www.instagram.com/reel/DYjg7D6IEPM/",
    platform: "instagram",
    embedId: "DYjg7D6IEPM",
    durationEst: "18s",
    hook: "Macro camera tilts across thousands of glass beads on slipper strap, sparkling under pinpoint light",
    shootingDirection: {
      cameraPositionAndFraming: "Vertical 9:16. Extreme macro (3 inches away) focused on intricate geometric bead pattern.",
      cameraMovement: "Slow orbital camera tilt around the slipper strap.",
      lightingAndSet: "Dark velvet backdrop with 2 focused pinpoint spot beams creating multi-angle bead reflections.",
      actionBreakdown: "• 0:00–0:06: Hand holds slipper, tilts it slowly: beads sparkle in wave of light.\n• 0:06–0:12: Finger gently traces the bead contour showing secure tight stitchwork.\n• 0:12–0:18: Flips slipper to show cushioned leather insole base.",
      talentAndHandBlocking: "Slow, delicate tilting of the slipper to allow lights to hit different bead facets.",
      soundAndAudioCues: "Delicate glass bead clink, gentle melodic flute/strings track.",
      propsAndGear: ["Hand-beaded slippers", "Small LED torch / spotlight", "Dark velvet fabric"],
      directorExecutionNotes: "Move a small LED torch slowly by hand across the beads to trigger dynamic light sparkles."
    }
  },
  {
    id: "ugc-slipper-5",
    title: "Slippers Reference: Work from Home Shoe Kick & Plush Slide Step",
    section: "ugc-slippers",
    sectionName: "Slippers & Slides",
    categoryTag: "WFH House Slippers",
    url: "https://www.tiktok.com/@marni.creates/video/7557763668524485918",
    platform: "tiktok",
    embedId: "7557763668524485918",
    durationEst: "16s",
    hook: "Kicks off uncomfortable outdoor shoes with one foot flick, steps immediately into plush supportive house slides",
    shootingDirection: {
      cameraPositionAndFraming: "Vertical 9:16. Low 45° angle looking at feet near home office desk.",
      cameraMovement: "Locked off on tripod.",
      lightingAndSet: "Warm, cozy ambient home office lighting.",
      actionBreakdown: "• 0:00–0:04: Feet in stiff outdoor shoes pause near desk. Right foot kicks left shoe off, then vice versa.\n• 0:04–0:09: Feet slide effortlessly into waiting plush house slippers with thick arch support.\n• 0:09–0:16: Talent wiggles toes inside slippers, sits back into desk chair with a long sigh.",
      talentAndHandBlocking: "Casual, effortless kick-off motion without bending over.",
      soundAndAudioCues: "Shoe drop thud, plush slide sound, sigh of relaxation, cozy lo-fi beat.",
      propsAndGear: ["Plush house slippers", "Stiff outdoor shoes", "Desk & chair setup"],
      directorExecutionNotes: "Time the kick-off and slip-in to be continuous and satisfying in under 6 seconds."
    }
  },

  // ================= FASHION & GARMENTS =================
  {
    id: "ugc-fashion-1",
    title: "Fashion Reference: Tailored Two-Piece 360° Fit & Fabric Flow",
    section: "ugc-fashion",
    sectionName: "Fashion & Garments",
    categoryTag: "Co-ord Two Piece Set",
    url: "https://www.instagram.com/reel/DFsv40JooGB/?stkn=YTF4dTNmcWt2MXdm",
    platform: "instagram",
    embedId: "DFsv40JooGB",
    durationEst: "22s",
    hook: "Model turns 360° in tailored palazzo pants and top as fabric flows in gentle breeze",
    shootingDirection: {
      cameraPositionAndFraming: "Vertical 9:16. Full-body shot (50mm lens, 10 feet away) keeping head and shoes in frame.",
      cameraMovement: "Slow orbital gimbal move wrapping 180° around model as she turns.",
      lightingAndSet: "Bright studio lighting with warm backlight separating model from neutral architectural backdrop.",
      actionBreakdown: "• 0:00–0:06: Model stands facing camera, hands resting on waistline, smiles.\n• 0:06–0:14: Turns slowly 360°, letting wide palazzo pant legs flow and drape.\n• 0:14–0:22: Steps forward toward camera, checks neckline, poses with hand on hip.",
      talentAndHandBlocking: "Slow, elegant turn. Hands move smoothly from waist to hair.",
      soundAndAudioCues: "Silk/cotton fabric rustle, upbeat chic runway audio track.",
      propsAndGear: ["Tailored 2-piece set", "Gimbal", "Small electric fan for subtle breeze"],
      directorExecutionNotes: "Position a small fan on lowest setting outside frame to create natural fabric movement."
    }
  },
  {
    id: "ugc-fashion-2",
    title: "Fashion Reference: Kaftan Collar Embroidery & Cuff Button Snap",
    section: "ugc-fashion",
    sectionName: "Fashion & Garments",
    categoryTag: "Bespoke Kaftan",
    url: "https://www.instagram.com/p/DavOWbIn9wp/?stkn=MXhjemUzeG1iaHJuNw==",
    platform: "instagram",
    embedId: "DavOWbIn9wp",
    durationEst: "20s",
    hook: "Macro camera glides down geometric collar embroidery to chest pocket, followed by wrist button snap",
    shootingDirection: {
      cameraPositionAndFraming: "Vertical 9:16. Close-up (50mm lens) framed from chest to chin.",
      cameraMovement: "Slow buttery vertical tilt down from collar to cuff.",
      lightingAndSet: "High-CRI studio lighting bringing out the contrast between embroidery thread and linen fabric.",
      actionBreakdown: "• 0:00–0:06: Slow tilt down intricate collar and chest embroidery.\n• 0:06–0:12: Man's hands fasten cuff button on left sleeve with crisp click.\n• 0:12–0:20: Adjusts collar with two fingers, raises chin, looks directly into lens.",
      talentAndHandBlocking: "Precise, dignified grooming gestures.",
      soundAndAudioCues: "Button snap sound, fabric brush, rich Afrobeats instrumental.",
      propsAndGear: ["Tailored Kaftan with embroidery", "Macro lens", "5600K balanced light"],
      directorExecutionNotes: "Press/iron the collar razor-sharp before filming—camera macros catch any wrinkle."
    }
  },
  {
    id: "ugc-fashion-3",
    title: "Fashion Reference: Heavyweight Cotton Streetwear Pull & Drape",
    section: "ugc-fashion",
    sectionName: "Fashion & Garments",
    categoryTag: "Streetwear T-Shirt",
    url: "https://www.instagram.com/reel/Ddl1YWdxT6w/?stkn=bjRybzh1dTQxMWJi",
    platform: "instagram",
    embedId: "Ddl1YWdxT6w",
    durationEst: "18s",
    hook: "Model pulls firmly on ribbed collar to prove zero stretch-out, then shakes heavy fabric drape",
    shootingDirection: {
      cameraPositionAndFraming: "Vertical 9:16. Medium shot from waist up. Urban concrete or warehouse backdrop.",
      cameraMovement: "Dynamic handheld with energetic whip-zooms.",
      lightingAndSet: "Direct natural daylight or gritty industrial studio lighting.",
      actionBreakdown: "• 0:00–0:05: Model grabs ribbed collar with both hands, tugs outward firmly; collar springs back tight.\n• 0:05–0:11: Turns around, shows heavyweight boxy drape across shoulders and back.\n• 0:11–0:18: Steps forward, crosses arms over chest, nods into camera.",
      talentAndHandBlocking: "Confident streetwear swagger. Firm collar pull with no hesitance.",
      soundAndAudioCues: "Fabric snap sound on release, heavy hip-hop beat drop on head nod.",
      propsAndGear: ["Heavyweight 240+ GSM cotton tee", "Cargo pants / sneakers"],
      directorExecutionNotes: "Direct model to pull collar firmly—it visually proves heavyweight durability."
    }
  },
  {
    id: "ugc-fashion-4",
    title: "Fashion Reference: Breathable Linen Shirt Sunlit Garden Walk",
    section: "ugc-fashion",
    sectionName: "Fashion & Garments",
    categoryTag: "Linen Resort Shirt",
    url: "https://www.instagram.com/reel/DbKHu5XMYC7/?stkn=eGx3eHJ2dHpjMmQ3",
    platform: "instagram",
    embedId: "DbKHu5XMYC7",
    durationEst: "18s",
    hook: "Afternoon sun shining through loose linen weave as breeze flutters open shirt collar",
    shootingDirection: {
      cameraPositionAndFraming: "Vertical 9:16. Medium shot tracking alongside talent walking through outdoor greenery.",
      cameraMovement: "Gimbal tracking at walking pace.",
      lightingAndSet: "Backlit afternoon golden sun filtering through palm fronds/leaves.",
      actionBreakdown: "• 0:00–0:06: Talent walks in profile, unbuttons top two buttons of breathable linen shirt.\n• 0:06–0:12: Rolls up cuffs two turns on forearm.\n• 0:12–0:18: Puts on sunglasses, looks toward camera with relaxed weekend smile.",
      talentAndHandBlocking: "Relaxed, effortless movements. Natural arm swing.",
      soundAndAudioCues: "Gentle breeze, rustling leaves, relaxed acoustic chords.",
      propsAndGear: ["Pure linen shirt", "Sunglasses", "Outdoor garden setting"],
      directorExecutionNotes: "Shoot during golden hour so backlighting through linen weave shows its open breathability."
    }
  },
  {
    id: "ugc-fashion-5",
    title: "Fashion Reference: Contemporary Adire Dye Silk Twirl",
    section: "ugc-fashion",
    sectionName: "Fashion & Garments",
    categoryTag: "Adire Silk Maxi Dress",
    url: "https://www.instagram.com/reel/DbF7p7pxYWs/?stkn=aHB4bWdjNTI4OTBy",
    platform: "instagram",
    embedId: "DbF7p7pxYWs",
    durationEst: "20s",
    hook: "Model spins slowly as fluid silk Adire dress hem lifts like liquid indigo in sunset light",
    shootingDirection: {
      cameraPositionAndFraming: "Vertical 9:16. Full length (35mm lens, 12 feet away) keeping entire flowing dress in frame.",
      cameraMovement: "Slow 360° circular gimbal wrap around spinning model.",
      lightingAndSet: "Warm sunset / golden hour backlight creating glowing halo around silk dress hem.",
      actionBreakdown: "• 0:00–0:06: Model stands facing away, turns over shoulder to look at lens.\n• 0:06–0:14: Spins in 2 continuous elegant twirls, dress hem lifts and floats like water.\n• 0:14–0:20: Settles from spin, catches hem in hand, smiles radiant smile.",
      talentAndHandBlocking: "Graceful turn with arms lifted slightly to allow dress to balloon.",
      soundAndAudioCues: "Silk fabric fluttering sound, atmospheric vocal swell on soundtrack.",
      propsAndGear: ["Adire silk dress", "Gimbal stabilizer", "Sunset outdoor location"],
      directorExecutionNotes: "Time the twirl with the sun directly behind the model's head for an organic lens flare."
    }
  },
  {
    id: "ugc-fashion-6",
    title: "Fashion Reference: Garment Bag Unzip & Closet Rail Hanging",
    section: "ugc-fashion",
    sectionName: "Fashion & Garments",
    categoryTag: "Packaging & Delivery",
    url: "https://www.instagram.com/reel/Ddgq2yGMmup/?stkn=ajBhOWoxMjJ5aml1",
    platform: "instagram",
    embedId: "Ddgq2yGMmup",
    durationEst: "20s",
    hook: "Long brass zipper pulls down center of breathable garment bag, unveiling freshly tailored suit",
    shootingDirection: {
      cameraPositionAndFraming: "Vertical 9:16. Eye level framing of garment hanging on wardrobe rail.",
      cameraMovement: "Locked off static on tripod, 4 feet away.",
      lightingAndSet: "Warm boutique bedroom / closet lighting.",
      actionBreakdown: "• 0:00–0:06: Hand unzips center garment bag zipper from neck to hem.\n• 0:06–0:12: Opens left and right panels, revealing tailored outfit on wooden hanger.\n• 0:12–0:17: Lifts wooden hanger off rail, holds garment up in full view.\n• 0:17–0:20: Smooths lapel with hand.",
      talentAndHandBlocking: "Smooth continuous zipper pull with one hand holding bag bottom taut.",
      soundAndAudioCues: "Long metallic zipper glide, wooden hanger clink on metal rail, fabric rustle.",
      propsAndGear: ["Breathable garment bag", "Wooden hanger", "Custom tailored garment", "Wardrobe rail"],
      directorExecutionNotes: "Leave 2 inches of empty space on rail so the hanger clink is loud and clean."
    }
  }
];
