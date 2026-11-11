// Facts of the client only (veon/client.json: company.contacts, W-F001…W-F013, products_services).
// Nothing here may be invented: no prices, numbers or claims beyond client.json.

export interface Line {
  digit: "8" | "7" | "9";
  name: string;
  short: string;
  phone: string;
  tel: string;
  anchor: string;
}

export const lines: Line[] = [
  { digit: "8", name: "СТО сервіс", short: "СТО", phone: "068 46 46 383", tel: "tel:+380684646383", anchor: "#services" },
  { digit: "7", name: "Шиномонтаж", short: "Шиномонтаж", phone: "068 46 46 373", tel: "tel:+380684646373", anchor: "#tyres" },
  { digit: "9", name: "Автозапчастини", short: "Запчастини", phone: "068 46 46 393", tel: "tel:+380684646393", anchor: "#parts" },
];

export const sto = lines[0];
export const tyres = lines[1];
export const parts = lines[2];

export const viber = {
  label: "Viber",
  phone: "068 46 46 383",
  href: "viber://chat?number=%2B380684646383",
};

export const address = {
  full: "вулиця Володимира Великого, 8а, Львів",
  street: "вул. Володимира Великого, 8а",
  city: "Львів",
  map: "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("вулиця Володимира Великого, 8а, Львів"),
};

// W-F001: exactly as on the client's site; Sunday is not stated, so it is not shown.
export const hours = {
  week: { days: "Пн–Пт", full: "Понеділок–п'ятниця", time: "09:00–20:00" },
  saturday: { days: "Сб", full: "Субота", time: "09:00–16:00", note: "шиномонтаж" },
};

export const nav = [
  { href: "#services", label: "Послуги" },
  { href: "#tyres", label: "Шиномонтаж" },
  { href: "#parts", label: "Запчастини" },
  { href: "#trust", label: "Про нас" },
  { href: "#contacts", label: "Контакти" },
];

export interface PriceItem { name: string; from?: boolean; price: number; }
export interface PriceGroup { id: string; title: string; items: PriceItem[]; note?: string; }

// W-F005 … W-F008
export const priceGroups: PriceGroup[] = [
  {
    id: "diag",
    title: "Діагностика",
    items: [
      { name: "Комп'ютерна діагностика", price: 500 },
      { name: "Діагностика ходової", price: 600 },
      { name: "Перевірка технічних рідин", price: 400 },
      { name: "Діагностика системи охолодження та гальмівної системи", from: true, price: 500 },
    ],
  },
  {
    id: "to",
    title: "Техобслуговування",
    items: [
      { name: "Заміна оливи в двигуні", from: true, price: 400 },
      { name: "Заміна повітряного фільтра", price: 250 },
      { name: "Заміна ременя ГРМ", from: true, price: 4500 },
      { name: "Заміна охолоджувальної рідини", price: 700 },
      { name: "Заміна гальмівної рідини", price: 600 },
    ],
  },
  {
    id: "chassis",
    title: "Ремонт ходової",
    items: [
      { name: "Заміна амортизатора", from: true, price: 750 },
      { name: "Заміна кульової опори", from: true, price: 750 },
      { name: "Заміна ступичного підшипника", from: true, price: 1250 },
      { name: "Заміна втулок стабілізатора", from: true, price: 500 },
    ],
  },
  {
    id: "ac",
    title: "Кондиціонер",
    items: [{ name: "Обслуговування кондиціонера: перевірка, заправка, дезінфекція", price: 1800 }],
  },
];

// products_services without a published price: no figure is shown.
export const alsoRepair = [
  "Автоелектрика: проводка, сигналізація, ксенон, парктроніки",
  "Ремонт гальмівної системи",
  "Ремонт двигуна",
  "Зчеплення та трансмісія",
  "Рульовий механізм",
  "Система охолодження",
  "Вихлопна система",
];

// W-F009
export const tyrePrice = { fromRadius: "R13–14", from: 1100, toRadius: "R22", to: 2200 };
export const radii = ["R13", "R14", "R15", "R16", "R17", "R18", "R19", "R20", "R21", "R22"];
export const storage = [
  { radius: "R13–16", price: 1300 },
  { radius: "R17–23", price: 1500 },
];
export const tyreServices = [
  "Шиномонтаж і балансування",
  "Бортування RunOnFlat",
  "Заміна датчиків тиску",
  "Вулканізація та ремонт проколів",
  "Рихтування та зварювання дисків, зокрема легкосплавних і титанових",
  "Сезонне зберігання шин",
];
export const vehicleTypes = ["Легкові", "Кросовери та позашляховики", "Мікроавтобуси", "Вантажні R17,5–R19,5"];

export const brands = [
  "Audi", "BMW", "Volvo", "Jeep", "Dodge", "Kia", "Chrysler", "Lexus", "Land Rover", "Mazda",
  "Mercedes", "Mitsubishi", "Nissan", "Opel", "Peugeot", "Renault", "SEAT", "Citroën", "Subaru", "Suzuki",
  "Toyota", "Fiat", "Volkswagen", "Ford", "Honda", "Hyundai", "Chevrolet", "Škoda",
];

export const formatPrice = (n: number) => n.toLocaleString("uk-UA").replace(/ |\s/g, " ");
