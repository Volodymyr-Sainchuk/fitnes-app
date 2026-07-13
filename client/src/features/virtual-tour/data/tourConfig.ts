export type TourRoomId =
  | "reception"
  | "gym"
  | "cardio"
  | "functional-zone"
  | "group-classes"
  | "locker-rooms"
  | "sauna"
  | "fitness-bar";

export type TourHotspot = {
  id: string;
  roomId: TourRoomId;
  title: string;
  description: string;
  photos: string[];
  yaw: string;
  pitch: string;
};

export type TourLink = {
  target: TourRoomId;
  label: string;
  yaw: string;
  pitch: string;
};

export type TourRoom = {
  id: TourRoomId;
  title: string;
  description: string;
  panorama: string;
  thumbnail: string;
  mapX: number;
  mapY: number;
  defaultYaw: string;
  defaultPitch: string;
  hotspot: TourHotspot;
  links: TourLink[];
};

export const TOUR_ROOMS: TourRoom[] = [
  {
    id: "reception",
    title: "Reception",
    description: "Головний вхід, зустріч гостей, консультації щодо абонементів.",
    panorama: "/virtual-tour/club_8782262a16.png",
    thumbnail: "/virtual-tour/club_8782262a16.png",
    mapX: 18,
    mapY: 24,
    defaultYaw: "0deg",
    defaultPitch: "-4deg",
    hotspot: {
      id: "hotspot-reception",
      roomId: "reception",
      title: "Reception",
      description:
        "Тут вас зустрічає команда клубу: підбір абонементу, персональні консультації та навігація по всіх зонах.",
      photos: ["/virtual-tour/club_8782262a16.png", "/virtual-tour/club_a128e2595e.png"],
      yaw: "-8deg",
      pitch: "-6deg",
    },
    links: [
      { target: "gym", label: "До зали", yaw: "34deg", pitch: "-8deg" },
      { target: "fitness-bar", label: "До фітобару", yaw: "-44deg", pitch: "-8deg" },
    ],
  },
  {
    id: "gym",
    title: "Gym",
    description: "Основна силова зона з тренажерами MATRIX і вільними вагами.",
    panorama: "/virtual-tour/club_fe2bd894bc.png",
    thumbnail: "/virtual-tour/club_fe2bd894bc.png",
    mapX: 44,
    mapY: 36,
    defaultYaw: "14deg",
    defaultPitch: "-5deg",
    hotspot: {
      id: "hotspot-gym",
      roomId: "gym",
      title: "Gym",
      description:
        "Професійна тренажерна зала для силових і функціональних тренувань: лави, стійки, кросовери, вільні ваги.",
      photos: ["/virtual-tour/club_fe2bd894bc.png", "/virtual-tour/club_ba3654242f.png"],
      yaw: "12deg",
      pitch: "-5deg",
    },
    links: [
      { target: "cardio", label: "До кардіо", yaw: "50deg", pitch: "-9deg" },
      { target: "functional-zone", label: "До функціональної", yaw: "-34deg", pitch: "-8deg" },
    ],
  },
  {
    id: "cardio",
    title: "Cardio",
    description: "Кардіотеатр із біговими доріжками, еліпсами та велотренажерами.",
    panorama: "/virtual-tour/club_59d8859760.png",
    thumbnail: "/virtual-tour/club_59d8859760.png",
    mapX: 63,
    mapY: 26,
    defaultYaw: "8deg",
    defaultPitch: "-4deg",
    hotspot: {
      id: "hotspot-cardio",
      roomId: "cardio",
      title: "Cardio",
      description: "Кардіозона для розминки, HIIT і витривалості з сучасним обладнанням і зручним оглядом усієї зали.",
      photos: ["/virtual-tour/club_59d8859760.png", "/virtual-tour/club_146f5302d2.png"],
      yaw: "5deg",
      pitch: "-6deg",
    },
    links: [
      { target: "gym", label: "До зали", yaw: "-36deg", pitch: "-8deg" },
      { target: "functional-zone", label: "До функціональної", yaw: "44deg", pitch: "-7deg" },
    ],
  },
  {
    id: "functional-zone",
    title: "Functional Zone",
    description: "Зона функціонального тренінгу, мобільності, TRX і bodyweight-workout.",
    panorama: "/virtual-tour/club_146f5302d2.png",
    thumbnail: "/virtual-tour/club_146f5302d2.png",
    mapX: 44,
    mapY: 52,
    defaultYaw: "6deg",
    defaultPitch: "-5deg",
    hotspot: {
      id: "hotspot-functional-zone",
      roomId: "functional-zone",
      title: "Functional Zone",
      description:
        "Функціональна зона для кругових тренувань, координації та розвитку стабілізації з різними форматами навантаження.",
      photos: ["/virtual-tour/club_146f5302d2.png", "/virtual-tour/club_a5ab8d8fe9.png"],
      yaw: "10deg",
      pitch: "-5deg",
    },
    links: [
      { target: "group-classes", label: "До групових", yaw: "-42deg", pitch: "-9deg" },
      { target: "locker-rooms", label: "До роздягалень", yaw: "32deg", pitch: "-8deg" },
    ],
  },
  {
    id: "group-classes",
    title: "Group Classes",
    description: "Студія групових програм: силові, dance, cycling, stretching та wellness-напрями.",
    panorama: "/virtual-tour/club_a5ab8d8fe9.png",
    thumbnail: "/virtual-tour/club_a5ab8d8fe9.png",
    mapX: 25,
    mapY: 60,
    defaultYaw: "-10deg",
    defaultPitch: "-6deg",
    hotspot: {
      id: "hotspot-group-classes",
      roomId: "group-classes",
      title: "Group Classes",
      description: "Простір для групових тренувань з динамічним розкладом і форматами для різних рівнів підготовки.",
      photos: ["/virtual-tour/club_a5ab8d8fe9.png", "/virtual-tour/club_8782262a16.png"],
      yaw: "-8deg",
      pitch: "-6deg",
    },
    links: [
      { target: "functional-zone", label: "До функціональної", yaw: "36deg", pitch: "-8deg" },
      { target: "sauna", label: "До сауни", yaw: "-34deg", pitch: "-8deg" },
    ],
  },
  {
    id: "locker-rooms",
    title: "Locker Rooms",
    description: "Комфортні роздягальні з шафками, душовими і доступом у recovery-зону.",
    panorama: "/virtual-tour/club_a128e2595e.png",
    thumbnail: "/virtual-tour/club_a128e2595e.png",
    mapX: 65,
    mapY: 62,
    defaultYaw: "2deg",
    defaultPitch: "-5deg",
    hotspot: {
      id: "hotspot-locker-rooms",
      roomId: "locker-rooms",
      title: "Locker Rooms",
      description:
        "Роздягальні обладнані шафками, душовими та прямим проходом до сауни для відновлення після тренувань.",
      photos: ["/virtual-tour/club_a128e2595e.png", "/virtual-tour/club_ba3654242f.png"],
      yaw: "4deg",
      pitch: "-6deg",
    },
    links: [
      { target: "sauna", label: "До сауни", yaw: "30deg", pitch: "-8deg" },
      { target: "reception", label: "До рецепції", yaw: "-44deg", pitch: "-8deg" },
    ],
  },
  {
    id: "sauna",
    title: "Sauna",
    description: "Тепла recovery-зона для відновлення після силових і кардіо-сесій.",
    panorama: "/virtual-tour/placeholder.svg",
    thumbnail: "/virtual-tour/placeholder.svg",
    mapX: 78,
    mapY: 72,
    defaultYaw: "0deg",
    defaultPitch: "-5deg",
    hotspot: {
      id: "hotspot-sauna",
      roomId: "sauna",
      title: "Sauna",
      description:
        "Сауна входить у wellness-маршрут клубу: зручна після тренувань, допомагає відновленню та релаксації.",
      photos: ["/virtual-tour/placeholder.svg", "/virtual-tour/club_a128e2595e.png"],
      yaw: "0deg",
      pitch: "-6deg",
    },
    links: [
      { target: "locker-rooms", label: "До роздягалень", yaw: "-26deg", pitch: "-8deg" },
      { target: "fitness-bar", label: "До фітобару", yaw: "44deg", pitch: "-7deg" },
    ],
  },
  {
    id: "fitness-bar",
    title: "Fitness Bar",
    description: "Зона відпочинку з напоями, протеїновими коктейлями та healthy-snacks.",
    panorama: "/virtual-tour/club_ba3654242f.png",
    thumbnail: "/virtual-tour/club_ba3654242f.png",
    mapX: 20,
    mapY: 42,
    defaultYaw: "-12deg",
    defaultPitch: "-6deg",
    hotspot: {
      id: "hotspot-fitness-bar",
      roomId: "fitness-bar",
      title: "Fitness Bar",
      description:
        "Післятренувальний фітобар з напоями та спортивним харчуванням для швидкого відновлення і балансу енергії.",
      photos: ["/virtual-tour/club_ba3654242f.png", "/virtual-tour/club_8782262a16.png"],
      yaw: "-10deg",
      pitch: "-7deg",
    },
    links: [
      { target: "reception", label: "До рецепції", yaw: "28deg", pitch: "-8deg" },
      { target: "locker-rooms", label: "До роздягалень", yaw: "-42deg", pitch: "-9deg" },
    ],
  },
];

export const TOUR_SEQUENCE: TourRoomId[] = TOUR_ROOMS.map((room) => room.id);

export const ROOM_BY_ID = TOUR_ROOMS.reduce<Record<TourRoomId, TourRoom>>(
  (accumulator, room) => {
    accumulator[room.id] = room;
    return accumulator;
  },
  {} as Record<TourRoomId, TourRoom>,
);
