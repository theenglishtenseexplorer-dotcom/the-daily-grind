// Normalized world coordinates (0..1) keep the map responsive to canvas size.
export const nodes = {
  start:{x:.49,y:.53}, cross:{x:.49,y:.39}, west:{x:.27,y:.39}, westUp:{x:.27,y:.24},
  north:{x:.49,y:.20}, east:{x:.72,y:.39}, eastUp:{x:.72,y:.24},
  south:{x:.49,y:.72}, plazaPath:{x:.70,y:.72}, officePath:{x:.87,y:.53},
  storeDoor:{x:.18,y:.19}, carinderiaDoor:{x:.82,y:.19},
  plazaDoor:{x:.79,y:.82}, officeDoor:{x:.93,y:.48}
};
export const edges = [
  ["start","cross"],["cross","west"],["west","westUp"],["westUp","storeDoor"],
  ["cross","north"],["north","eastUp"],["eastUp","carinderiaDoor"],
  ["cross","east"],["east","eastUp"],["cross","south"],["south","plazaPath"],["plazaPath","plazaDoor"],
  ["east","officePath"],["officePath","officeDoor"]
];
export const destinations = {
  store:{name:"Aling Nena’s Sari-Sari Store",short:"Sari-Sari Store",emoji:"🏪",door:"storeDoor",returnNode:"storeDoor",desc:"Aling Nena’s shelves are stocked with pandesal, barako coffee, and cold calamansi juice.",color:"#d97b45"},
  carinderia:{name:"Kuya Jun’s Karinderya",short:"Karinderya",emoji:"🍲",door:"carinderiaDoor",returnNode:"carinderiaDoor",desc:"The smell of freshly cooked tapsilog and chicken adobo fills the little eatery.",color:"#c95f43"},
  plaza:{name:"Barangay Plaza",short:"Barangay Plaza",emoji:"🌳",door:"plazaDoor",returnNode:"plazaDoor",desc:"A shaded neighborhood hangout. Mika might be around.",color:"#5b9b64"},
  office:{name:"Skyline Enterprises",short:"Skyline Enterprises",emoji:"🏢",door:"officeDoor",returnNode:"officeDoor",desc:"Your job interview is waiting upstairs. Take a breath—you’ve got this.",color:"#5d85a8"}
};
