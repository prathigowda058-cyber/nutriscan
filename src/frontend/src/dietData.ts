export interface MealOption {
  name: string;
  emoji: string;
  kcal: number;
  nutrients: string;
}

export interface RegionMeals {
  breakfast: MealOption[];
  lunch: MealOption[];
  dinner: MealOption[];
  snacks: MealOption[];
}

export const mealsByRegion: Record<string, RegionMeals> = {
  Karnataka: {
    breakfast: [
      {
        name: "Ragi Dosa with Sambar",
        emoji: "🥞",
        kcal: 220,
        nutrients: "Calcium 180mg, Iron 3mg, Fiber 4g",
      },
      {
        name: "Idli with Coconut Chutney",
        emoji: "🍚",
        kcal: 180,
        nutrients: "Carbs 35g, Protein 5g, B-vitamins",
      },
      {
        name: "Akki Rotti with Chutney",
        emoji: "🫓",
        kcal: 260,
        nutrients: "Carbs 42g, Iron 2mg, Fiber 3g",
      },
      {
        name: "Upma with Peanuts",
        emoji: "🥣",
        kcal: 240,
        nutrients: "Protein 8g, Niacin 2mg, Iron 2mg",
      },
      {
        name: "Set Dosa with Saagu",
        emoji: "🥞",
        kcal: 300,
        nutrients: "Carbs 55g, Protein 7g, B12 trace",
      },
    ],
    lunch: [
      {
        name: "Bisi Bele Bath with Papad",
        emoji: "🍛",
        kcal: 420,
        nutrients: "Protein 15g, Iron 4mg, Zinc 2mg",
      },
      {
        name: "Jolada Rotti with Dal",
        emoji: "🫓",
        kcal: 380,
        nutrients: "Protein 14g, Fiber 8g, Iron 3mg",
      },
      {
        name: "Drumstick Sambar with Rice",
        emoji: "🍲",
        kcal: 360,
        nutrients: "Vitamin C 40mg, Iron 5mg, Calcium 120mg",
      },
      {
        name: "Vangi Bath with Raita",
        emoji: "🍆",
        kcal: 400,
        nutrients: "Antioxidants, Fiber 6g, B-vitamins",
      },
    ],
    dinner: [
      {
        name: "Ragi Mudde with Sambar",
        emoji: "🫙",
        kcal: 340,
        nutrients: "Calcium 210mg, Iron 4mg, Fiber 6g",
      },
      {
        name: "Chapati with Palak Paneer",
        emoji: "🫓",
        kcal: 380,
        nutrients: "Iron 6mg, Calcium 200mg, Protein 18g",
      },
      {
        name: "Rice with Kootu and Rasam",
        emoji: "🍚",
        kcal: 320,
        nutrients: "Vitamin C 25mg, Fiber 5g, Iron 3mg",
      },
    ],
    snacks: [
      {
        name: "Chikki (Jaggery Peanut Bar)",
        emoji: "🍫",
        kcal: 150,
        nutrients: "Iron 2mg, Zinc 1mg, Energy boost",
      },
      {
        name: "Boiled Groundnuts",
        emoji: "🥜",
        kcal: 160,
        nutrients: "Protein 7g, Niacin 3mg, Zinc 1mg",
      },
      {
        name: "Banana with Honey",
        emoji: "🍌",
        kcal: 120,
        nutrients: "Potassium 400mg, B6 0.4mg, Vitamin C 10mg",
      },
    ],
  },
  Maharashtra: {
    breakfast: [
      {
        name: "Poha with Peanuts",
        emoji: "🥣",
        kcal: 250,
        nutrients: "Iron 3mg, Carbs 40g, Protein 6g",
      },
      {
        name: "Sabudana Khichdi",
        emoji: "🍚",
        kcal: 300,
        nutrients: "Carbs 55g, Calcium 50mg, Energy",
      },
      {
        name: "Thalipeeth with Curd",
        emoji: "🫓",
        kcal: 280,
        nutrients: "Protein 10g, Fiber 5g, Iron 3mg",
      },
      {
        name: "Vada Pav",
        emoji: "🥙",
        kcal: 320,
        nutrients: "Carbs 50g, Iron 2mg, B-vitamins",
      },
    ],
    lunch: [
      {
        name: "Puran Poli with Ghee",
        emoji: "🫓",
        kcal: 450,
        nutrients: "Protein 12g, Iron 4mg, Calcium 80mg",
      },
      {
        name: "Misal Pav",
        emoji: "🍲",
        kcal: 380,
        nutrients: "Protein 16g, Fiber 8g, Iron 5mg",
      },
      {
        name: "Varan Bhaat",
        emoji: "🍛",
        kcal: 340,
        nutrients: "Protein 13g, Zinc 2mg, B-vitamins",
      },
      {
        name: "Bharli Vangi with Rice",
        emoji: "🍆",
        kcal: 360,
        nutrients: "Antioxidants, Fiber 6g, Iron 3mg",
      },
    ],
    dinner: [
      {
        name: "Bhakri with Usal",
        emoji: "🫓",
        kcal: 350,
        nutrients: "Protein 14g, Fiber 9g, Iron 4mg",
      },
      {
        name: "Sol Kadhi with Rice",
        emoji: "🍚",
        kcal: 300,
        nutrients: "Vitamin C 15mg, Probiotics, Calcium 60mg",
      },
      {
        name: "Chapati with Sabzi",
        emoji: "🫓",
        kcal: 360,
        nutrients: "Fiber 6g, Iron 3mg, B-vitamins",
      },
    ],
    snacks: [
      {
        name: "Chivda",
        emoji: "🍿",
        kcal: 180,
        nutrients: "Iron 2mg, Carbs 28g, Protein 5g",
      },
      {
        name: "Ukad (Rice Porridge)",
        emoji: "🥣",
        kcal: 140,
        nutrients: "Carbs 30g, Calcium 40mg, Easy digestion",
      },
      {
        name: "Modak",
        emoji: "🍡",
        kcal: 200,
        nutrients: "Carbs 38g, Coconut fat, Energy",
      },
    ],
  },
  "Tamil Nadu": {
    breakfast: [
      {
        name: "Pongal with Sambar",
        emoji: "🍚",
        kcal: 280,
        nutrients: "Protein 9g, Carbs 45g, Iron 3mg",
      },
      {
        name: "Idiyappam with Coconut Milk",
        emoji: "🍜",
        kcal: 260,
        nutrients: "Carbs 50g, Calcium 80mg, Iron 2mg",
      },
      {
        name: "Dosa with Tomato Chutney",
        emoji: "🥞",
        kcal: 220,
        nutrients: "Carbs 38g, Vitamin C 20mg, B-vitamins",
      },
      {
        name: "Adai with Avial",
        emoji: "🥞",
        kcal: 290,
        nutrients: "Protein 11g, Fiber 5g, Iron 3mg",
      },
    ],
    lunch: [
      {
        name: "Chettinad Chicken Curry with Rice",
        emoji: "🍛",
        kcal: 520,
        nutrients: "Protein 35g, Iron 5mg, B12 2µg",
      },
      {
        name: "Keerai Kootu with Rice",
        emoji: "🍃",
        kcal: 350,
        nutrients: "Iron 8mg, Calcium 180mg, Vitamin K",
      },
      {
        name: "Rasam Rice with Papad",
        emoji: "🍚",
        kcal: 310,
        nutrients: "Vitamin C 30mg, Iron 3mg, Antioxidants",
      },
    ],
    dinner: [
      {
        name: "Idli with Sambar",
        emoji: "🍚",
        kcal: 240,
        nutrients: "Protein 8g, Carbs 42g, B-vitamins",
      },
      {
        name: "Chapati with Dal Tadka",
        emoji: "🫓",
        kcal: 370,
        nutrients: "Protein 16g, Iron 4mg, Fiber 7g",
      },
      {
        name: "Upma with Vegetables",
        emoji: "🥣",
        kcal: 280,
        nutrients: "Vitamin A 120µg, Iron 2mg, Fiber 4g",
      },
    ],
    snacks: [
      {
        name: "Murukku",
        emoji: "🌀",
        kcal: 160,
        nutrients: "Carbs 25g, Iron 1mg, Sesame calcium",
      },
      {
        name: "Tender Coconut Water",
        emoji: "🥥",
        kcal: 50,
        nutrients: "Electrolytes, Potassium 600mg, Vitamin C",
      },
      {
        name: "Banana Chips",
        emoji: "🍌",
        kcal: 170,
        nutrients: "Potassium 300mg, Carbs 28g, Vitamin B6",
      },
    ],
  },
  Delhi: {
    breakfast: [
      {
        name: "Aloo Paratha with Dahi",
        emoji: "🫓",
        kcal: 380,
        nutrients: "Carbs 58g, Calcium 150mg, Vitamin C 15mg",
      },
      {
        name: "Chole Bhature",
        emoji: "🫔",
        kcal: 520,
        nutrients: "Protein 18g, Iron 6mg, Fiber 8g",
      },
      {
        name: "Besan Cheela with Chutney",
        emoji: "🥞",
        kcal: 270,
        nutrients: "Protein 12g, Folate 80µg, Iron 3mg",
      },
      {
        name: "Dal Paratha",
        emoji: "🫓",
        kcal: 350,
        nutrients: "Protein 13g, Fiber 6g, Iron 4mg",
      },
    ],
    lunch: [
      {
        name: "Dal Makhani with Naan",
        emoji: "🍛",
        kcal: 550,
        nutrients: "Protein 20g, Iron 6mg, Calcium 100mg",
      },
      {
        name: "Rajma Chawal",
        emoji: "🍚",
        kcal: 480,
        nutrients: "Protein 22g, Iron 8mg, Fiber 12g",
      },
      {
        name: "Palak Paneer with Roti",
        emoji: "🍃",
        kcal: 430,
        nutrients: "Iron 7mg, Calcium 250mg, Vitamin A 400µg",
      },
      {
        name: "Kadhi Pakora with Rice",
        emoji: "🍲",
        kcal: 400,
        nutrients: "Calcium 120mg, Protein 14g, B-vitamins",
      },
    ],
    dinner: [
      {
        name: "Butter Chicken with Paratha",
        emoji: "🍗",
        kcal: 580,
        nutrients: "Protein 38g, B12 2µg, Iron 4mg",
      },
      {
        name: "Methi Dal with Roti",
        emoji: "🫓",
        kcal: 370,
        nutrients: "Iron 5mg, Folate 100µg, Fiber 8g",
      },
      {
        name: "Paneer Tikka with Salad",
        emoji: "🧀",
        kcal: 360,
        nutrients: "Protein 22g, Calcium 300mg, B12 1µg",
      },
    ],
    snacks: [
      {
        name: "Samosa",
        emoji: "🥟",
        kcal: 200,
        nutrients: "Carbs 30g, Iron 2mg, Vitamin C 10mg",
      },
      {
        name: "Lassi",
        emoji: "🥛",
        kcal: 180,
        nutrients: "Calcium 300mg, Protein 8g, Probiotics",
      },
      {
        name: "Jalebi",
        emoji: "🍩",
        kcal: 220,
        nutrients: "Carbs 45g, Iron trace, Energy boost",
      },
    ],
  },
  Other: {
    breakfast: [
      {
        name: "Sprouted Moong Chaat",
        emoji: "🫛",
        kcal: 190,
        nutrients: "Protein 10g, Folate 90µg, Iron 3mg",
      },
      {
        name: "Oats Upma",
        emoji: "🥣",
        kcal: 230,
        nutrients: "Fiber 5g, Iron 3mg, Beta-glucan",
      },
      {
        name: "Daliya with Milk",
        emoji: "🥣",
        kcal: 260,
        nutrients: "Protein 9g, Calcium 180mg, Iron 3mg",
      },
    ],
    lunch: [
      {
        name: "Mixed Dal Tadka with Rice",
        emoji: "🍛",
        kcal: 400,
        nutrients: "Protein 18g, Iron 5mg, Zinc 3mg",
      },
      {
        name: "Vegetable Khichdi",
        emoji: "🍚",
        kcal: 360,
        nutrients: "Protein 14g, Vitamin A 200µg, Iron 3mg",
      },
      {
        name: "Curd Rice with Pickle",
        emoji: "🍚",
        kcal: 320,
        nutrients: "Calcium 200mg, Probiotics, B-vitamins",
      },
    ],
    dinner: [
      {
        name: "Multigrain Roti with Sabzi",
        emoji: "🫓",
        kcal: 350,
        nutrients: "Fiber 8g, Iron 4mg, B-vitamins",
      },
      {
        name: "Tomato Soup with Bread",
        emoji: "🍅",
        kcal: 240,
        nutrients: "Vitamin C 35mg, Lycopene, Iron 2mg",
      },
      {
        name: "Lauki Dal with Rice",
        emoji: "🍲",
        kcal: 330,
        nutrients: "Calcium 80mg, Iron 4mg, Fiber 6g",
      },
    ],
    snacks: [
      {
        name: "Mixed Fruit with Chaat Masala",
        emoji: "🍎",
        kcal: 130,
        nutrients: "Vitamin C 50mg, Potassium 380mg, Fiber",
      },
      {
        name: "Roasted Makhana",
        emoji: "🫘",
        kcal: 120,
        nutrients: "Calcium 60mg, Iron 1mg, Low fat",
      },
      {
        name: "Homemade Granola Bar",
        emoji: "🍫",
        kcal: 180,
        nutrients: "Fiber 4g, Iron 2mg, Energy",
      },
    ],
  },
};
