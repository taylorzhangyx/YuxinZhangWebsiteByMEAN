var Product = require('../models/product');

var mongoose = require('mongoose');

mongoose.connect('localhost:27017/yuxinzhangpw');
mongoose.Promise = global.Promise;

var products = [
new Product({
  name: 'WOW',
  picture: 'http://www.blogcdn.com/wow.joystiq.com/media/2011/06/veterangiveaway580.jpg',
  description: "Many WoW players were shocked and confused to learn that they had a free copy of World of Warcraft Classic (it's the new \"official\" vanilla) sitting in their inbox starting last week. In a push for more subscribers before the big patch 4.2 push, tons of free copies of the game were distributed out to veterans to give to friends to introduce them to World of Warcraft. Not only is the game free, but these veteran reward accounts come with 30 day subscriptions for your buddies.",
  price: 50,
  seller: "Yuxin Zhang",
}),
new Product({
  name: 'SC2',
  picture: "https://bnetproduct-a.akamaihd.net//dg/6524/A83148AAF499738362A1B4C59DFF4919862766E5.png",
  description: "All things must come to an end —— but with the psionic power of the Protoss on your side, fear is an illusion. Guide the Protoss as they struggle to unite the three races in the ultimate battle for survival against an ancient evil threatening all life in the universe. Experience the epic conclusion to the StarCraft II trilogy and find out who perseveres in the face of adversity.",
  price: 36.99,
  seller: "Yuxin Zhang",
}),
new Product({
  name: "One Night In Karazhan",
  picture: 'https://bnetproduct-a.akamaihd.net//dg/7949/CD6AD2CB94B50E30736510B166606D22071919C1.png',
  description: "Step into Karazhan for one magical night! Medivh, grand party host and mage extraordinaire, has conjured up an unforgettable evening for Azeroth’s elite—and you are cordially invited. From the phenomenal Parlor to the sorcerous Spire, make your way through Karazhan to save the party and earn 45 unique cards in this single player adventure!",
  price: 19.99,
  seller: "Yuxin Zhang",
}),
new Product({
  name: 'OVERWATCH',
  picture: 'https://bnetproduct-a.akamaihd.net//dg/7513/7ECA09BFA14F61AA2C412113341FFBCB5775F360.png',
  description:  "Clash on the battlefields of tomorrow and choose your hero from a diverse cast of soldiers, scientists, adventurers, and oddities. Bend time, defy physics, and unleash an array of extraordinary powers and weapons. Engage your enemies in iconic locations from around the globe in the ultimate team-based shooter. Take your place in Overwatch. The world needs heroes.",
  price: 38.99,
  seller: "Yuxin Zhang",
}),
new Product({
  name: 'Diablo III',
  picture: 'https://bnetproduct-a.akamaihd.net//dg/641/A4580CA3D8C402ED3A387821F178DDAA3CAE6460.png',
  description:  "The Prime Evil rages within the Black Soulstone, its essence screaming for vengeance and release. Before the artifact can be sealed away forever, Malthael – Angel of Death – manifests in the mortal realms with a deadly new purpose: to steal the Black Soulstone and bend its infernal power to his will. So begins the end of all things…",
  price: 19.99,
  seller: "Yuxin Zhang",
})

];

var done = 0;
for (var i = 0; i < products.length; i++) {
  products[i].save(function(err, result) {
    done++;
    if (done === products.length) {
      exit();
    }
  });
}

function exit() {
  mongoose.disconnect();
}
