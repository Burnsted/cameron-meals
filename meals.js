/* Cameron's menu data. Edit this file to change meals, toppings, sides, or prices.
   Prices: "est." = estimate for St. Pete-area stores, Oct 2026. Items with src:"A"/"P"/"AP"
   came from the store's online listing (aldi.us / delivery.publix.com) in Oct 2026; the rest are estimates. */
window.CAM = {
STORES:["Aldi","Publix","Walmart","Target","Trader Joe's","Winn-Dixie","Costco","Sam's Club"],

EQUIP:[
  {id:"foreman",label:"George Foreman grill",emoji:"🔥",featured:true},
  {id:"lavazza",label:"Lavazza espresso maker",emoji:"☕"},
  {id:"nespresso",label:"Nespresso + refillable capsules",emoji:"☕"},
  {id:"stove",label:"Stovetop",emoji:"🍳"},
  {id:"oven",label:"Oven",emoji:"♨️"},
  {id:"micro",label:"Microwave",emoji:"📟"},
  {id:"airfryer",label:"Air fryer",emoji:"💨"},
  {id:"slow",label:"Slow cooker",emoji:"🍲"},
  {id:"rice",label:"Rice cooker",emoji:"🍚"},
  {id:"sheet",label:"Sheet pan",emoji:"🟫"},
  {id:"skillet",label:"Skillet",emoji:"🍳"}
],

/* Ingredient screens ("build" steps). Each meal shows only its CORE items (pre-selected, ▾ = swap list).
   Everything else lives in EXTRAS behind one "+ Add extras" button (not pre-selected).
   k = price key in PRICES (adds to the shopping list), kv = price key per swap choice. */
BUILDS:{
 burger:{emoji:"🍔",title:"Build your burger",
  core:[
   {id:"patty",label:"Patty",protein:true,v:["80/20 beef patty","Ground sirloin patty"]},
   {id:"bun",label:"Bun",v:["Sesame bun","Brioche bun","Potato bun","Plain white bun","Lettuce wrap"]},
   {id:"cheese",label:"Cheese",v:["American cheese","Cheddar","Pepper jack","Swiss","Provolone"]},
   {id:"onion",label:"Onion",v:["White onion","Red onion","Sweet onion"]},
   {id:"pickles",label:"Pickles",v:["Dill chips","Dill spears","Bread & butter pickles"]}],
  extras:[
   {id:"lettuce",label:"Lettuce"},{id:"tomato",label:"Tomato"},{id:"ketchup",label:"Ketchup"},{id:"mustard",label:"Mustard"},
   {id:"mayo",label:"Mayo"},{id:"bacon",label:"Bacon"},{id:"avocado",label:"Avocado"},{id:"jalapeno",label:"Jalapeños"},
   {id:"bbq",label:"BBQ sauce"},{id:"hot",label:"Hot sauce"},{id:"gonion",label:"Grilled onions"},{id:"mushroom",label:"Mushrooms"},{id:"egg",label:"Fried egg"}]},
 steak:{emoji:"🥩",title:"Your steak",
  core:[
   {id:"season",label:"Seasoning",v:["Steak seasoning","Salt & pepper","Montreal steak","Garlic & herb"],k:"season"},
   {id:"done",label:"Doneness",v:["Medium rare","Medium","Medium well","Well done"]},
   {id:"butter",label:"Butter",v:["Garlic butter","Plain butter"],k:"butter"},
   {id:"sauce",label:"Sauce",v:["A1","Heinz 57","BBQ sauce","Chimichurri"],kv:{"A1":"steaksauce","Heinz 57":"steaksauce","BBQ sauce":"bbq"}},
   {id:"onions",label:"Onions",v:["Grilled onions","Mushrooms & onions"],k:"onion"}],
  extras:[{id:"mush",label:"Mushrooms",k:"mushroom"},{id:"blue",label:"Blue cheese crumbles",k:"bluecheese"},{id:"egg",label:"Fried egg",k:"eggs"},{id:"hot",label:"Hot sauce",k:"hot"},{id:"horse",label:"Horseradish",k:"horseradish"}]},
 chicken:{emoji:"🍗",title:"Your grilled chicken",
  core:[
   {id:"season",label:"Seasoning",v:["Lemon pepper","Garlic & herb","Cajun","BBQ rub","Salt & pepper"],k:"season"},
   {id:"marinade",label:"Marinade",v:["Olive oil","Italian dressing","Teriyaki"],kv:{"Italian dressing":"dressing","Teriyaki":"teriyaki"}},
   {id:"sauce",label:"Dip",v:["BBQ","Ranch","Buffalo","Honey mustard"],kv:{"BBQ":"bbq","Ranch":"dressing","Buffalo":"hot"}},
   {id:"cheese",label:"Melted cheese",v:["Provolone","Pepper jack","Cheddar","Mozzarella"],k:"cheeseslice"}],
  extras:[{id:"bacon",label:"Bacon",k:"bacon"},{id:"avo",label:"Avocado",k:"avocado"},{id:"gonion",label:"Grilled onions",k:"onion"},{id:"tomato",label:"Tomato",k:"tomato"},{id:"hot",label:"Hot sauce",k:"hot"}]},
 chixq:{emoji:"🫓",title:"Your quesadilla / panini",
  core:[
   {id:"wrap",label:"Tortilla",v:["Flour tortilla","Whole wheat tortilla","Low-carb tortilla","Sourdough (panini)"],kv:{"Flour tortilla":"tortilla","Whole wheat tortilla":"tortilla","Low-carb tortilla":"tortilla","Sourdough (panini)":"bread"}},
   {id:"cheese",label:"Cheese",v:["Mexican blend","Cheddar","Pepper jack","Mozzarella"],k:"shred"},
   {id:"meat",label:"Leftover chicken"},
   {id:"salsa",label:"Salsa",v:["Mild salsa","Medium salsa","Hot salsa","Pico de gallo"],k:"salsa"},
   {id:"sour",label:"Sour cream",k:"sourcream"}],
  extras:[{id:"jal",label:"Jalapeños",k:"jalpickled"},{id:"op",label:"Onions & peppers",k:"veg:Onions & peppers"},{id:"beans",label:"Black beans",k:"blackbeans"},{id:"bacon",label:"Bacon",k:"bacon"},{id:"guac",label:"Guacamole",k:"guac"},{id:"hot",label:"Hot sauce",k:"hot"}]},
 steakq:{emoji:"🌮",title:"Your steak quesadilla",
  core:[
   {id:"wrap",label:"Tortilla",v:["Flour tortilla","Whole wheat tortilla","Low-carb tortilla"],k:"tortilla"},
   {id:"cheese",label:"Cheese",v:["Mexican blend","Cheddar","Pepper jack","Mozzarella"],k:"shred"},
   {id:"meat",label:"Leftover steak"},
   {id:"salsa",label:"Salsa",v:["Mild salsa","Medium salsa","Hot salsa","Pico de gallo"],k:"salsa"},
   {id:"gonion",label:"Grilled onions",k:"onion"}],
  extras:[{id:"pep",label:"Peppers",k:"veg:Onions & peppers"},{id:"jal",label:"Jalapeños",k:"jalpickled"},{id:"sour",label:"Sour cream",k:"sourcream"},{id:"guac",label:"Guacamole",k:"guac"},{id:"hot",label:"Hot sauce",k:"hot"}]},
 stkegg:{emoji:"🍳",title:"Your steak & eggs",
  core:[
   {id:"eggs",label:"Eggs",v:["Scrambled","Over easy","Sunny side up","Fried hard"],k:"eggs"},
   {id:"meat",label:"Leftover steak"},
   {id:"toast",label:"Toast",v:["Toast","English muffin","No bread"],kv:{"Toast":"bread"}}],
  extras:[{id:"hot",label:"Hot sauce",k:"hot"},{id:"cheese",label:"Shredded cheese",k:"shred"},{id:"salsa",label:"Salsa",k:"salsa"},{id:"avo",label:"Avocado",k:"avocado"}]},
 bowl:{emoji:"🍚",title:"Your rice bowl",
  core:[
   {id:"rice",label:"Rice",v:["White rice","Brown rice","Cilantro-lime rice","Fried rice"]},
   {id:"meat",label:"Grilled chicken"},
   {id:"veg",label:"Veggies",v:["Broccoli","Peppers & onions","Corn","Mixed veggies"],kv:{"Broccoli":"broccoli","Peppers & onions":"veg:Onions & peppers","Corn":"corn","Mixed veggies":"corn"}},
   {id:"top",label:"Topping",v:["Green onions","Sesame seeds","Shredded cheese"],kv:{"Green onions":"greenonion","Shredded cheese":"shred"}}],
  extras:[{id:"egg",label:"Fried egg",k:"eggs"},{id:"hot",label:"Sriracha",k:"hot"},{id:"beans",label:"Black beans",k:"blackbeans"},{id:"avo",label:"Avocado",k:"avocado"},{id:"corn",label:"Corn",k:"corn"}]},
 pork:{emoji:"🐖",title:"Your pork",
  core:[
   {id:"season",label:"Seasoning",v:["BBQ rub","Salt & pepper","Garlic & herb","Cajun"],k:"season"},
   {id:"sauce",label:"Sauce",v:["BBQ sauce","Applesauce","Honey mustard"],kv:{"BBQ sauce":"bbq"}}],
  extras:[{id:"gonion",label:"Grilled onions",k:"onion"},{id:"mush",label:"Mushrooms",k:"mushroom"},{id:"hot",label:"Hot sauce",k:"hot"},{id:"pick",label:"Pickles",k:"pickles"}]},
 brats:{emoji:"🌭",title:"Your brats",
  core:[
   {id:"bun",label:"Bun",v:["Hot dog bun","Hoagie roll","No bun"],kv:{"Hot dog bun":"hotdogbun","Hoagie roll":"hotdogbun"}},
   {id:"mustard",label:"Mustard",v:["Yellow mustard","Spicy brown","Dijon"],k:"mustard"},
   {id:"op",label:"Peppers & onions",k:"veg:Onions & peppers"}],
  extras:[{id:"ketchup",label:"Ketchup",k:"ketchup"},{id:"relish",label:"Relish",k:"relish"},{id:"kraut",label:"Sauerkraut",k:"sauerkraut"},{id:"cheese",label:"Shredded cheese",k:"shred"},{id:"jal",label:"Jalapeños",k:"jalpickled"}]}
},

/* Side groups (veg / starch / other). Cheap, grill/microwave-friendly at Aldi & Publix.
   prep = rough minutes. a/p = Aldi/Publix est. store = prefer that chain when set. */
/* kcal = rough per-serving from USDA FoodData Central typical servings; always show as ~ / est., rounded to 10. */
SIDE_GROUPS:[
 {id:"veg",label:"Veg",emoji:"🥦",items:[
  {n:"Steamable green beans",prep:5,kcal:40,a:1.49,p:2.29,aisle:"frozen"},
  {n:"Broccoli",prep:5,kcal:50,a:1.79,p:2.99,aisle:"produce"},
  {n:"Corn on the cob",prep:6,kcal:90,a:2.49,p:3.49,aisle:"produce"},
  {n:"Grilled zucchini or peppers",prep:8,kcal:60,a:3.99,p:5.79,aisle:"produce"},
  {n:"Caesar salad kit",prep:3,kcal:180,a:2.99,p:4.49,aisle:"produce"},
  {n:"Baby carrots + ranch",prep:2,kcal:120,a:2.49,p:3.79,aisle:"produce"},
  {n:"Asparagus",prep:6,kcal:40,a:2.99,p:4.49,aisle:"produce"}
 ]},
 {id:"starch",label:"Starch",emoji:"🥔",items:[
  {n:"Baked / microwave potato",prep:8,kcal:160,a:1.20,p:1.80,aisle:"produce"},
  {n:"Sweet potato",prep:8,kcal:110,a:1.50,p:2.20,aisle:"produce"},
  {n:"Microwave rice cups / Ready Rice",prep:2,kcal:210,a:1.29,p:2.29,aisle:"pantry"},
  {n:"Mac & cheese",prep:8,kcal:350,a:0.79,p:1.29,aisle:"pantry"},
  {n:"Garlic bread / Texas toast",prep:8,kcal:180,a:2.49,p:3.99,aisle:"frozen"},
  {n:"Baked beans",prep:3,kcal:160,a:1.29,p:1.99,aisle:"pantry"},
  {n:"Pasta salad (deli)",prep:0,kcal:280,a:null,p:4.99,aisle:"grab",store:"Publix"},
  {n:"Tortillas",prep:1,kcal:140,a:1.99,p:3.29,aisle:"bread"},
  {n:"Potato salad",prep:0,kcal:230,a:2.99,p:4.49,aisle:"dairy"},
  {n:"Frozen tater tots / air-fryer fries",prep:12,kcal:250,a:2.49,p:3.99,aisle:"frozen"}
 ]},
 {id:"other",label:"Other",emoji:"🥗",items:[
  {n:"Cottage cheese",prep:0,kcal:110,a:2.29,p:3.49,aisle:"dairy"},
  {n:"Deli coleslaw",prep:0,kcal:150,a:2.49,p:3.99,aisle:"dairy"},
  {n:"Chips & salsa",prep:2,kcal:220,a:3.48,p:6.48,aisle:"snacks"},
  {n:"Fruit cup",prep:0,kcal:70,a:1.49,p:2.49,aisle:"produce"},
  {n:"Yogurt",prep:0,kcal:130,a:3.30,p:6.00,aisle:"dairy"},
  {n:"Banana / fruit",prep:0,kcal:100,a:1.50,p:2.00,aisle:"produce"},
  {n:"Potato chips",prep:0,kcal:160,a:2.19,p:5.49,aisle:"snacks"}
 ]}
],
/* Per-cut / per-patty calorie overrides (est. per serving). Unknown / Other → null (UI shows cal: ?). */
PROTEIN_CAL:{
 "Sirloin":480,"Filet":420,"Ribeye":560,"NY strip":500,"Flat iron":450,"Chuck eye":480,
 "Chicken breast":280,"Chicken thighs":320,"Chicken tenders":260,
 "Boneless pork chops":330,"Country-style ribs (boneless)":380,
 "Brats":400,"Italian sausage":390,"Smoked sausage (pre-cooked)":350,
 "80/20 beef patty":550,"Ground sirloin patty":480
},
/* Flat names for chips; Custom opens SIDE_GROUPS instead of a blank field. */
SIDES:["Steamable green beans","Broccoli","Corn on the cob","Grilled zucchini or peppers","Caesar salad kit","Baby carrots + ranch","Asparagus","Baked / microwave potato","Sweet potato","Microwave rice cups / Ready Rice","Mac & cheese","Garlic bread / Texas toast","Baked beans","Pasta salad (deli)","Tortillas","Potato salad","Frozen tater tots / air-fryer fries","Cottage cheese","Deli coleslaw","Chips & salsa","Fruit cup","Yogurt","Banana / fruit","Potato chips"],
/* Legacy drill kept only if a side still uses brand/flavor steps (none of the new defaults). */
DRILL:{},

/* Meals for the Yes/No step. grill:true = Foreman-friendly. temp = USDA safe minimum.
   prep / cook = rough minutes shown beside the big emoji (cook = Foreman time).
   nut = rough per-serving estimate (calories, g protein) built from USDA FoodData Central values for the main parts
   (e.g. 6 oz cooked chicken breast, 8 oz cooked sirloin, 1/3 lb 80/20 patty + bun + 1 slice cheese, 10" tortilla + 1/2 cup cheese).
   Shown as "est." only; real numbers vary with portions and toppings. */
/* protein:true = multi-select cuts/kinds (steak, chicken, pork, brats). Burger patty uses BUILDS.burger.core patty.
   grab:true = grab-and-go (0–5 min). store = which shopping list section. */
MEALS:[
 {id:"steak",prep:5,cook:7,nut:{kcal:480,p:62},emoji:"🥩",name:"Steak night",protein:true,v:["Sirloin","Filet","Ribeye","NY strip","Flat iron","Chuck eye"],grill:true,
  time:"about 4–7 min (1-inch steak)",temp:"145°F + 3 min rest",
  grill:["Pat dry, salt + pepper or steak seasoning.","Preheat Foreman 5 min with the lid closed.","Lay steak on, close lid: about 4–7 min. Don't press down.","Check thickest part: 145°F, then rest 3 min before cutting."],
  stove:["Hot skillet, a little oil.","About 4–5 min per side for a 1-inch steak.","145°F, rest 3 min."]},
 {id:"burger",prep:10,cook:6,nut:{kcal:550,p:37},emoji:"🍔",name:"Burgers",grill:true,time:"about 4–6 min (⅓ lb patty)",temp:"160°F (ground beef)",
  grill:["Make ⅓ lb patties, thumb a dent in the middle.","Season both sides.","Foreman preheated, lid closed: about 4–6 min.","160°F in the middle. Cheese on for the last 30 sec."],
  stove:["Skillet medium-high.","About 4 min per side.","160°F in the middle."]},
 {id:"chicken",prep:10,cook:8,nut:{kcal:280,p:53},emoji:"🍗",name:"Grilled chicken",protein:true,v:["Chicken breast","Chicken thighs","Chicken tenders"],grill:true,time:"about 6–8 min (¾-inch thick)",temp:"165°F",
  grill:["Thick breast? Slice it in half sideways so it's even (¾ inch).","Oil + seasoning.","Foreman lid closed: about 6–8 min.","165°F in the thickest part. Rest 5 min so it stays juicy."],
  stove:["Skillet medium, a little oil.","About 5–7 min per side.","165°F."]},
 {id:"chixq",prep:5,cook:5,nut:{kcal:570,p:46},emoji:"🫓",name:"Chicken quesadilla / panini",v:["Quesadilla","Panini"],grill:true,time:"about 3–5 min",temp:"leftover chicken reheated to 165°F",
  grill:["Use leftover grilled chicken, sliced.","Tortilla (or 2 slices bread) + cheese + chicken.","Foreman = panini press: lid closed about 3–5 min till cheese melts.","Inside should be steaming hot (165°F)."],
  stove:["Skillet medium, no oil needed.","About 2–3 min per side till cheese melts."]},
 {id:"steakq",prep:5,cook:4,nut:{kcal:670,p:51},emoji:"🌮",name:"Steak quesadilla",grill:true,time:"about 3–4 min",temp:"leftover steak hot through",
  grill:["Slice leftover steak thin.","Tortilla + cheese + steak + salsa, fold.","Foreman lid closed about 3–4 min."],
  stove:["Skillet medium, about 2–3 min per side."]},
 {id:"stkegg",prep:3,cook:5,nut:{kcal:460,p:46},emoji:"🍳",name:"Steak & eggs",grill:true,time:"steak 1–2 min reheat · eggs 2–3 min",temp:"eggs till firm",
  grill:["Warm sliced leftover steak on the Foreman 1–2 min.","Eggs: skillet 2–3 min, or microwave scramble 1–1.5 min, stir halfway.","Cook eggs till no runny white."],
  stove:["Eggs in skillet 2–3 min; steak in the same pan 1–2 min."]},
 {id:"bowl",prep:5,cook:8,nut:{kcal:450,p:40},emoji:"🍚",name:"Chicken rice bowl",v:["Teriyaki","BBQ","Salsa + cheese","Plain"],grill:true,time:"about 6–8 min chicken · rice 90 sec",temp:"chicken 165°F",
  grill:["Grill chicken (or use leftovers), slice.","Rice: microwave pouch 90 sec, or rice cooker.","Rice + chicken + sauce + any grilled veggies."],
  stove:["Cook chicken in skillet 5–7 min per side, 165°F.","Rice + chicken + sauce."]},
 {id:"pork",prep:5,cook:7,nut:{kcal:330,p:46},emoji:"🐖",name:"Pork chops / country-style ribs",protein:true,v:["Boneless pork chops","Country-style ribs (boneless)"],grill:true,time:"about 5–7 min (¾-inch chop)",temp:"145°F + 3 min rest",
  grill:["Season (BBQ rub or salt, pepper, garlic powder).","Foreman lid closed: chops about 5–7 min; thick country ribs about 8–12 min.","145°F, rest 3 min. Brush BBQ sauce on at the end."],
  stove:["Skillet medium-high, about 4–5 min per side.","145°F, rest 3 min."]},
 {id:"brats",prep:2,cook:14,nut:{kcal:400,p:16},emoji:"🌭",name:"Sausages / brats",protein:true,v:["Brats","Italian sausage","Smoked sausage (pre-cooked)"],grill:true,time:"fresh about 10–14 min · pre-cooked about 5–6 min",temp:"fresh 160°F · pre-cooked just heat through",
  grill:["Poke? No, keep the skin whole so they stay juicy.","Foreman lid closed: fresh brats about 10–14 min.","Fresh: 160°F inside. Pre-cooked smoked sausage: about 5–6 min till hot."],
  stove:["Skillet medium, turn often, about 12–15 min.","160°F."]},
 {id:"veg",prep:10,cook:6,nut:{kcal:80,p:2},emoji:"🫑",name:"Grilled veggies (side)",v:["Zucchini & peppers","Onions & peppers","Mushrooms","Asparagus"],grill:true,time:"about 4–6 min",temp:"till tender",
  grill:["Slice ½-inch thick, toss with oil + salt.","Foreman lid closed about 4–6 min.","Done when soft with grill marks."],
  stove:["Skillet medium-high, about 6–8 min, stirring."]},
 /* Grab & go — same Yes/No format; 0–5 min; planner mixes 1–2 nights/week by default */
 {id:"gg_rotisserie",prep:2,cook:0,nut:{kcal:520,p:48},emoji:"🍗",name:"Publix rotisserie chicken + bagged salad",grab:true,store:"Publix",tag:"🛍 Grab & go",
  time:"about 2 min",temp:"heat leftovers to 165°F",
  grill:["Pick up a hot Publix rotisserie chicken and a bagged salad.","Pull meat off the bone into containers. Eat tonight; fridge the rest for lunch."],
  stove:["Same: no cooking. Portion and eat."]},
 {id:"gg_pubsub",prep:1,cook:0,nut:{kcal:680,p:32},emoji:"🥖",name:"Publix Pub Sub",grab:true,store:"Publix",tag:"🛍 Grab & go",
  time:"about 1 min",temp:"ready to eat",
  grill:["Order your usual Pub Sub at the deli.","Eat half tonight, wrap the rest for tomorrow's lunch if you want."],
  stove:["Same: grab and go."]},
 {id:"gg_aldirot",prep:2,cook:0,nut:{kcal:500,p:45},emoji:"🐔",name:"Aldi rotisserie chicken or ready meal",grab:true,store:"Aldi",tag:"🛍 Grab & go",
  time:"about 2 min",temp:"heat leftovers to 165°F",
  grill:["Grab Aldi's rotisserie chicken (or a ready meal when they have it).","Portion into containers for dinner + lunch."],
  stove:["Same: no cooking."]},
 {id:"gg_delihot",prep:1,cook:0,nut:{kcal:620,p:35},emoji:"🍗",name:"Publix deli hot bar / fried chicken",grab:true,store:"Publix",tag:"🛍 Grab & go",
  time:"about 1 min",temp:"ready to eat",
  grill:["Hit the Publix deli hot bar or fried chicken case.","Get enough for dinner; skip leftovers that sit too long."],
  stove:["Same: grab and go."]},
 {id:"gg_pizza",prep:5,cook:0,nut:{kcal:700,p:28},emoji:"🍕",name:"Frozen pizza",grab:true,store:"Aldi",tag:"🛍 Grab & go",
  time:"about 5 min oven/microwave",temp:"hot through",
  grill:["Frozen pizza from Aldi (or Publix). Oven or microwave per the box.","About 12–18 min oven; microwave is faster if you've got one."],
  stove:["Oven or microwave per the box."]},
 {id:"gg_burritos",prep:3,cook:0,nut:{kcal:480,p:18},emoji:"🌯",name:"Aldi frozen burritos",grab:true,store:"Aldi",tag:"🛍 Grab & go",
  time:"about 3 min microwave",temp:"hot through",
  grill:["Microwave 1–2 Aldi frozen burritos per the box.","Add hot sauce if you want."],
  stove:["Microwave until hot."]},
 {id:"gg_sushi",prep:0,cook:0,nut:{kcal:450,p:22},emoji:"🍣",name:"Publix sushi",grab:true,store:"Publix",tag:"🛍 Grab & go",
  time:"0 min",temp:"ready to eat",
  grill:["Grab a Publix sushi tray from the cooler.","Eat the same day."],
  stove:["Same: ready to eat."]},
 {id:"gg_pbox",prep:0,cook:0,nut:{kcal:400,p:30},emoji:"🥡",name:"Protein box",grab:true,store:"Publix",tag:"🛍 Grab & go",
  time:"0 min",temp:"ready to eat",
  grill:["Publix (or Aldi) protein / snack box: meat, cheese, fruit or nuts.","No prep. Good night-off dinner."],
  stove:["Same: ready to eat."]}
],


/* Breakfast defaults (editable in Settings). kcal/price est. per serving. */
BREAKFAST:{
 weekdayDefault:"oatmeal",
 weekdayAlt:"bagel",
 weekend:"bec",
 altEveryWeeks:1.5, // ~1 weekday every 1–2 weeks
 items:{
  oatmeal:{id:"oatmeal",label:"Bowl of oatmeal",kcal:160,prep:3,a:0.45,p:0.70,keys:["oats"]},
  bagel:{id:"bagel",label:"Bagel + cream cheese",kcal:360,prep:3,a:1.40,p:2.20,keys:["bagels","creamcheese"]},
  bec:{id:"bec",label:"Bacon, egg & cheese bagel",kcal:520,prep:12,a:2.80,p:4.20,keys:["bagels","creamcheese","bacon","eggs","cheeseslice"]}
 }
},

/* Default kitchen rules (editable in Settings; saved on this phone). */
DEFAULT_RULES:[
 "Cook nights make 3–4 portions: eat 1, fridge the rest for lunch + the next dinner.",
 "Fridge: cooked leftovers last 3–4 days. Not eaten by day 4 → freezer.",
 "Freezer: split family packs into single bags the day you shop. Date them. Thaw overnight in the fridge.",
 "Temps: steak & pork 145°F + 3 min rest · burgers 160°F · chicken 165°F · leftovers 165°F.",
 "Lunch = leftovers in a container for Woody's. Breakfast is optional."
],

TIPS:{
 meat:[
  "Buy family / value packs: way cheaper per pound.",
  "Same day you shop: split into single portions in freezer bags.",
  "Write the date on every bag (Sharpie).",
  "Cooked leftovers: good 3–4 days in the fridge.",
  "Not eaten by day 4? Freeze it.",
  "Thaw overnight in the fridge, not on the counter.",
  "Cook once, eat 2–3 times: steak → steak plate → steak quesadilla → steak & egg bowl.",
  "Publix runs BOGO deals; Aldi is cheapest day-to-day on meat."
 ],
 temps:"Safe temps (USDA): steaks & pork chops 145°F + 3 min rest · burgers & ground meat 160°F · chicken 165°F · leftovers reheat to 165°F. A cheap instant-read thermometer (~$10–15) takes the guessing out."
},

/* Price catalog. a = Aldi est., p = Publix est. (null = not carried there).
   src: "A" Aldi online listing, "P" Publix online listing, "AP" both. aisle: meat, produce, dairy, bread, pantry, frozen, snacks */
/* Coffee — Cameron's real setup: Lavazza espresso maker + Nespresso with refillable tin capsules.
   He buys big cans/bags of Lavazza Qualità Oro and reseals into small capsules (~7 g per shot). */
COFFEE:{
 brands:["Lavazza Qualità Oro","Lavazza Qualità Rossa","Lavazza Super Crema","Illy","Other"],
 machines:[{id:"lavazza",label:"Lavazza espresso maker"},{id:"nespresso",label:"Nespresso + refillable capsules"}],
 drinks:[{id:"shot",label:"Espresso",emoji:"☕",milk:0},{id:"americano",label:"Americano",emoji:"☕",milk:0},
   {id:"latte",label:"Latte",emoji:"🥛",milk:8},{id:"iced",label:"Iced latte",emoji:"🧊",milk:6}],
 milks:["No milk","Whole","2%","Oat","Almond","Skim"],
 perWeek:[5,7,10,14,21],
 outPrice:5.50,
 gPerShot:7,          // ~7 g grounds per shot / capsule
 bagG:250,            // large can/bag unit (~250 g) — size line scales with drinks/week
 bagLabel:"large can/bag (~250 g)",
 lidsEveryWeeks:4,    // foil lids / seals — periodic restock
 milkOz:64
},

PRICES:{
 "coffee:oro":{n:"Lavazza Qualità Oro (large can/bag)",q:"~250 g",aisle:"coffee",a:null,p:null,custom:true,hint:"price: add from receipt (Publix / Amazon / warehouse). Est. only — don't invent a shelf price."},
 "coffee:lids":{n:"Capsule foil lids / seals (refillable tins)",q:"1 pack (periodic restock)",aisle:"coffee",a:null,p:null,custom:true,hint:"price: add from receipt · restock every few weeks"},
 "coffee:Whole":{n:"Whole milk",q:"½ gallon",aisle:"coffee",a:2.29,p:3.69},
 "coffee:2%":{n:"2% milk",q:"½ gallon",aisle:"coffee",a:2.29,p:3.69},
 "coffee:Skim":{n:"Skim milk",q:"½ gallon",aisle:"coffee",a:2.29,p:3.69},
 "coffee:Oat":{n:"Oat milk",q:"½ gallon (64 oz)",aisle:"coffee",a:2.99,p:4.99,hint:"est."},
 "coffee:Almond":{n:"Almond milk",q:"½ gallon",aisle:"coffee",a:2.49,p:3.79},
 chicken:{n:"Chicken breast, boneless skinless family pack",q:"~4 lb",aisle:"meat",a:9.62,p:22.12,src:"AP",hint:"Aldi listing $2.29/lb (Aldi says $1.99/lb in stores thru Nov 3) · Publix 4 lb+ pack $5.53/lb"},
 beef:{n:"Ground beef 80/20",q:"~2.25 lb pack (6 patties)",aisle:"meat",a:11.90,p:19.91,src:"AP",hint:"Aldi listing $5.29/lb · Publix listing $8.85/lb"},
 turkey:{n:"Ground turkey",q:"~2 lb",aisle:"meat",a:7.98,p:11.98},
 chickgr:{n:"Ground chicken",q:"~2 lb",aisle:"meat",a:7.98,p:11.98},
 sirloingr:{n:"Ground sirloin 90/10",q:"~2 lb",aisle:"meat",a:13.98,p:19.98},
 "steak:Sirloin":{n:"Top sirloin steak (2 steaks)",q:"~1.5 lb",aisle:"meat",a:14.99,p:18.29,src:"AP",hint:"Aldi listing $9.99/lb · Publix listing $12.19/lb"},
 "steak:Filet":{n:"Filet mignon (2 steaks)",q:"~1 lb",aisle:"meat",a:22.99,p:28.99},
 "steak:Ribeye":{n:"Ribeye steak (2 steaks)",q:"~1.5 lb",aisle:"meat",a:20.99,p:25.49},
 "steak:NY strip":{n:"NY strip steak (2 steaks)",q:"~1.5 lb",aisle:"meat",a:19.49,p:23.99},
 "steak:Flat iron":{n:"Flat iron steak",q:"~1.5 lb",aisle:"meat",a:13.49,p:17.99},
 "steak:Chuck eye":{n:"Chuck eye steak",q:"~1.5 lb",aisle:"meat",a:11.99,p:14.99},
 "chicken:Chicken breast":{n:"Chicken breast, boneless skinless family pack",q:"~4 lb",aisle:"meat",a:9.62,p:22.12,src:"AP"},
 "chicken:Chicken thighs":{n:"Chicken thighs, boneless skinless",q:"~2.5 lb",aisle:"meat",a:8.49,p:14.99},
 "chicken:Chicken tenders":{n:"Chicken tenders",q:"~2 lb",aisle:"meat",a:9.99,p:16.99},
 "gg_rotisserie":{n:"Publix rotisserie chicken + bagged salad",q:"1 chicken + 1 salad",aisle:"grab",a:null,p:12.48,store:"Publix"},
 "gg_pubsub":{n:"Publix Pub Sub",q:"1 sub",aisle:"grab",a:null,p:7.99,store:"Publix"},
 "gg_aldirot":{n:"Aldi rotisserie chicken or ready meal",q:"1",aisle:"grab",a:6.99,p:null,store:"Aldi"},
 "gg_delihot":{n:"Publix deli hot bar / fried chicken",q:"dinner portion",aisle:"grab",a:null,p:8.99,store:"Publix"},
 "gg_pizza":{n:"Frozen pizza",q:"1",aisle:"grab",a:3.99,p:5.49,store:"Aldi"},
 "gg_burritos":{n:"Aldi frozen burritos",q:"2–4 pack",aisle:"grab",a:3.49,p:null,store:"Aldi"},
 "gg_sushi":{n:"Publix sushi tray",q:"1",aisle:"grab",a:null,p:9.99,store:"Publix"},
 "gg_pbox":{n:"Protein / snack box",q:"1",aisle:"grab",a:4.99,p:6.49,store:"Publix"},
 "pork:Boneless pork chops":{n:"Boneless pork chops, family pack",q:"~2.5 lb (6 chops)",aisle:"meat",a:9.98,p:19.38,src:"AP",hint:"Aldi listing $3.99/lb · Publix listing $7.75/lb"},
 "pork:Country-style ribs (boneless)":{n:"Boneless country-style pork ribs",q:"~2.5 lb",aisle:"meat",a:8.73,p:12.48},
 "brats:Brats":{n:"Bratwurst",q:"1 pack (5–6)",aisle:"meat",a:2.69,p:8.75,src:"AP",hint:"Aldi Parkview 6 ct listing · Publix Johnsonville 5 ct listing"},
 "brats:Italian sausage":{n:"Italian sausage links",q:"1 pack (5)",aisle:"meat",a:3.99,p:6.99},
 "brats:Smoked sausage (pre-cooked)":{n:"Smoked sausage rope",q:"14 oz",aisle:"meat",a:2.99,p:4.99},
 bacon:{n:"Bacon",q:"12 oz",aisle:"meat",a:4.29,p:6.99},
 tbacon:{n:"Turkey bacon",q:"12 oz",aisle:"meat",a:2.99,p:4.99},
 eggs:{n:"Large eggs",q:"1 dozen",aisle:"dairy",a:1.85,p:2.19,src:"AP",hint:"Aldi Goldhen listing · Publix 12 ct listing"},
 cheeseslice:{n:"Sliced cheese",q:"1 pack",aisle:"dairy",a:2.49,p:4.29},
 shred:{n:"Shredded Mexican cheese",q:"8 oz",aisle:"dairy",a:2.29,p:3.49},
 yogurt:{n:"Yogurt cups",q:"6 cups",aisle:"dairy",a:3.30,p:6.00,hint:"Aldi price = Aldi's own brand"},
 lettuce:{n:"Lettuce",q:"1 head / bag",aisle:"produce",a:1.69,p:2.49},
 tomato:{n:"Tomatoes",q:"2",aisle:"produce",a:1.00,p:1.80},
 onion:{n:"Onions",q:"2",aisle:"produce",a:1.00,p:1.60},
 avocado:{n:"Avocados",q:"2",aisle:"produce",a:1.38,p:3.00},
 guac:{n:"Guacamole cups",q:"1 pack",aisle:"produce",a:3.49,p:4.99},
 jalfresh:{n:"Fresh jalapeños",q:"2",aisle:"produce",a:0.40,p:0.60},
 mushroom:{n:"Sliced mushrooms",q:"8 oz",aisle:"produce",a:1.79,p:2.99},
 "veg:Zucchini & peppers":{n:"Zucchini (2) + bell peppers (3 pk)",q:"for 3–4 sides",aisle:"produce",a:4.99,p:7.39},
 "veg:Onions & peppers":{n:"Bell peppers (3 pk) + 1 onion",q:"for 3–4 sides",aisle:"produce",a:3.99,p:5.79},
 "veg:Mushrooms":{n:"Whole mushrooms",q:"16 oz",aisle:"produce",a:2.99,p:4.99},
 "veg:Asparagus":{n:"Asparagus",q:"1 bunch",aisle:"produce",a:2.99,p:4.49},
 "Fruit:Apples":{n:"Apples",q:"3 lb bag",aisle:"produce",a:3.49,p:4.99},
 "Fruit:Bananas":{n:"Bananas",q:"~6",aisle:"produce",a:1.50,p:2.00},
 "Fruit:Grapes":{n:"Grapes",q:"~2 lb",aisle:"produce",a:3.98,p:5.98},
 "Fruit:Strawberries":{n:"Strawberries",q:"1 lb",aisle:"produce",a:2.49,p:3.99},
 "Fruit:Blueberries":{n:"Blueberries",q:"1 pint",aisle:"produce",a:2.99,p:4.49},
 "Fruit:Oranges":{n:"Oranges",q:"3 lb bag",aisle:"produce",a:3.99,p:5.49},
 "Fruit:Watermelon":{n:"Watermelon (cut, tub)",q:"1 tub",aisle:"produce",a:3.99,p:5.99},
 "Fruit:Pineapple":{n:"Pineapple",q:"1",aisle:"produce",a:1.99,p:3.49},
 "Salad:Garden":{n:"Garden salad bag",q:"1 bag",aisle:"produce",a:1.99,p:3.49},
 "Salad:Caesar":{n:"Caesar salad kit",q:"1 kit",aisle:"produce",a:2.99,p:4.49},
 "Salad:Spinach":{n:"Baby spinach",q:"1 bag",aisle:"produce",a:2.49,p:3.99},
 "Salad:Wedge":{n:"Iceberg head (wedge)",q:"1",aisle:"produce",a:1.69,p:2.49},
 dressing:{n:"Salad dressing",q:"1 bottle",aisle:"pantry",a:1.49,p:3.29},
 "bun:plain":{n:"Hamburger buns",q:"8 ct",aisle:"bread",a:1.55,p:4.41,src:"AP",hint:"Aldi L'oven Fresh listing · Publix Bakery 8 ct listing"},
 "bun:fancy":{n:"Buns",q:"4–8 ct",aisle:"bread",a:3.29,p:4.79},
 hotdogbun:{n:"Hot dog / brat buns",q:"8 ct",aisle:"bread",a:1.49,p:3.99},
 tortilla:{n:"Flour tortillas",q:"10 ct",aisle:"bread",a:1.99,p:3.29},
 bread:{n:"Sliced bread (panini/toast)",q:"1 loaf",aisle:"bread",a:1.49,p:3.29},
 oats:{n:"Rolled oats",q:"per breakfast",aisle:"pantry",a:0.45,p:0.70},
 bagels:{n:"Bagels",q:"each",aisle:"bread",a:0.45,p:0.70},
 creamcheese:{n:"Cream cheese",q:"1 tub",aisle:"dairy",a:2.49,p:3.79},
 ricepouch:{n:"Microwave rice pouches",q:"2",aisle:"pantry",a:2.58,p:3.98},
 ricebag:{n:"Long grain rice",q:"2 lb bag",aisle:"pantry",a:1.79,p:2.49},
 ketchup:{n:"Ketchup",q:"1 bottle",aisle:"pantry",a:1.89,p:3.49},
 mustard:{n:"Mustard",q:"1 bottle",aisle:"pantry",a:0.95,p:2.29},
 mayo:{n:"Mayo",q:"1 jar",aisle:"pantry",a:2.99,p:4.99},
 pickles:{n:"Pickles",q:"1 jar",aisle:"pantry",a:2.29,p:3.49},
 jalpickled:{n:"Pickled jalapeños",q:"1 jar",aisle:"pantry",a:1.79,p:2.69},
 bbq:{n:"BBQ sauce",q:"1 bottle",aisle:"pantry",a:1.49,p:2.99,hint:"Aldi price = Aldi's own brand"},
 hot:{n:"Hot sauce",q:"1 bottle",aisle:"pantry",a:1.29,p:2.99,hint:"Aldi price = Aldi's own brand"},
 salsa:{n:"Salsa",q:"1 jar",aisle:"pantry",a:1.99,p:3.49},
 teriyaki:{n:"Teriyaki sauce",q:"1 bottle",aisle:"pantry",a:1.99,p:3.49},
 season:{n:"Steak seasoning",q:"1 jar",aisle:"pantry",a:1.79,p:3.49},
 spray:{n:"Cooking spray",q:"1 can",aisle:"pantry",a:2.19,p:3.99},
 bags:{n:"Gallon freezer bags",q:"1 box",aisle:"pantry",a:2.49,p:4.49},
 fries:{n:"Frozen fries",q:"1 bag (~2 lb)",aisle:"frozen",a:2.49,p:3.99},
 chips:{n:"Chips",q:"1 bag",aisle:"snacks",a:2.19,p:5.49,hint:"Aldi price = Aldi's look-alike brand; Publix often has chips BOGO"},
 "chips:Pringles":{n:"Pringles",q:"1 can",aisle:"snacks",a:1.49,p:2.79,hint:"Aldi price = Aldi's look-alike stacked chips"},
 sourcream:{n:"Sour cream",q:"16 oz",aisle:"dairy",a:1.79,p:2.99},
 butter:{n:"Butter",q:"1 lb",aisle:"dairy",a:3.49,p:5.29},
 bluecheese:{n:"Blue cheese crumbles",q:"4 oz",aisle:"dairy",a:2.49,p:3.99},
 steaksauce:{n:"Steak sauce",q:"1 bottle",aisle:"pantry",a:2.49,p:4.49},
 horseradish:{n:"Horseradish",q:"1 jar",aisle:"pantry",a:1.99,p:3.29},
 relish:{n:"Sweet relish",q:"1 jar",aisle:"pantry",a:1.49,p:2.69},
 sauerkraut:{n:"Sauerkraut",q:"1 jar",aisle:"pantry",a:1.69,p:2.79},
 blackbeans:{n:"Black beans",q:"2 cans",aisle:"pantry",a:1.18,p:2.38},
 corn:{n:"Frozen corn",q:"1 bag",aisle:"frozen",a:1.19,p:2.29},
 broccoli:{n:"Broccoli crowns",q:"~1 lb",aisle:"produce",a:1.79,p:2.99},
 greenonion:{n:"Green onions",q:"1 bunch",aisle:"produce",a:0.89,p:1.29},
 "chips:Kettle Brand":{n:"Kettle Brand chips",q:"1 bag",aisle:"snacks",a:null,p:4.79,hint:"Not carried at Aldi"}
},

SOURCES:[
 ["Aldi chicken breast family pack $2.29/lb","https://www.aldi.us/store/aldi/products/19554637-fresh-family-pack-chicken-breasts-per-lb"],
 ["Aldi ground beef 80/20 $5.29/lb","https://www.aldi.us/store/aldi/products/17771077-ground-beef-80-20-1-per-lb"],
 ["Aldi top sirloin $9.99/lb","https://www.aldi.us/store/aldi/products/17679795-beef-choice-black-angus-top-sirloin-steak-per-lb"],
 ["Aldi boneless pork chops $3.99/lb","https://www.aldi.us/store/aldi/products/20275650-boneless-center-cut-pork-chops-per-lb"],
 ["Aldi Parkview brats $2.69","https://www.aldi.us/store/aldi/products/19990802-parkview-stadium-bratwurst-14-oz"],
 ["Aldi eggs $1.85/dozen","https://www.aldi.us/store/aldi/products/115095-goldhen-grade-a-large-eggs-12-ct"],
 ["Aldi hamburger buns $1.55","https://www.aldi.us/store/aldi/products/20873280-l-oven-fresh-hamburger-buns-12-oz"],
 ["Publix chicken breast 4 lb+ $5.53/lb","https://delivery.publix.com/store/publix/products/387470-publix-chicken-all-natural-boneless-skinless-chicken-breast-per-lb"],
 ["Publix ground beef $8.85/lb","https://delivery.publix.com/store/publix/products/380937-publix-market-ground-beef-1-15-lb"],
 ["Publix top sirloin $12.19/lb","https://www.instacart.com/products/3175190-publix-premium-top-sirloin-steak-per-lb?retailerSlug=publix"],
 ["Publix boneless pork chops $7.75/lb","https://delivery.publix.com/store/publix/products/387970-publix-pork-all-natural-boneless-pork-loin-chops-1-55-lb"],
 ["Publix Johnsonville brats $8.75","https://delivery.publix.com/store/publix/products/16427623-johnsonville-sausage-original-holiday-promo-brats-82-grm"],
 ["Publix eggs 12 ct $2.19","https://delivery.publix.com/store/publix/products/324877-publix-eggs-large-12-ct"],
 ["Publix bakery buns 8 ct $4.41","https://delivery.publix.com/store/publix/products/321487-publix-original-hamburger-buns-8-ct"]
],

REPO:{name:"cameron-meals",url:"https://github.com/Burnsted/cameron-meals",site:"https://burnsted.github.io/cameron-meals/"}
};
