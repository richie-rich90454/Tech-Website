// Shared Prisma row interfaces. These mirror the SQLite schemas under prisma/.
// Keep them in sync if the schema changes.

export interface SubmissionRow {
  id: number;
  techname: string;
  link: string;
  displaytext: string;
  tl1_desc: string;
  tl2_desc: string;
  tl3_desc: string;
  tl4_desc: string;
  accepted: boolean;
  username: string;
  contact: string;
}

export interface DomainRow {
  id: number;
  R: boolean;
  TP: boolean;
  MT: boolean;
  AR: boolean;
  U: boolean;
  MDL: boolean;
  RA: boolean;
  RoTech: boolean;
  LS: boolean;
  RoThink: boolean;
  EoST: boolean;
  EF: boolean;
  RTE: boolean;
  DLoI: boolean;
  RaAoC: boolean;
}

export interface UserRow {
  ID: number;
  username: string;
  password: string;
  email: string | null;
  rank: number;
  membership: number;
  expire: number;
  status: number;
  referral: string | null;
  referedBy: string | null;
  referralbalance: number;
  testattack: number;
  activity: number;
  twofactor: number;
  login_ip: string | null;
  login_useragent: string | null;
  cark: number;
  ban_sbp: number;
}

export interface LogRow {
  id: number;
  user: string;
  ip: string | null;
  time: number;
  method: string | null;
  postdata: string | null;
  mode: string | null;
  ratelimit: number;
  cookie: string | null;
  date: number;
  chart: string | null;
  stopped: number;
  handler: string | null;
  origin: string | null;
}

export interface PlanRow {
  id: number;
  name: string;
  vip: number;
  mbt: number;
  unit: string | null;
  length: number;
  price: number;
  concurrents: number;
  private: number;
}

export interface TicketRow {
  id: number;
  user: string;
  subject: string;
  status: string;
  date: number;
}

export interface MessageRow {
  id: number;
  ticketid: number;
  user: string;
  message: string;
  date: number;
}

export interface PaymentRow {
  id: number;
  user: string;
  plan: number;
  amount: number;
  paid: number;
  method: string | null;
  date: number;
}

export interface NewsRow {
  id: number;
  title: string;
  content: string;
  date: number;
}

export interface GiftCardRow {
  id: number;
  code: string;
  plan: number;
  claimedBy: string | null;
  generatedBy: string | null;
  generatedDate: number;
  claimedDate: number | null;
}

export interface ServerRow {
  id: number;
  name: string;
  ip: string;
  password: string | null;
  slots: number;
  methods: string | null;
}

export interface MethodRow {
  id: number;
  name: string;
  fullname: string;
  type: string;
  command: string | null;
}

export interface LoginLogRow {
  id: number;
  username: string;
  ip: string | null;
  country: string | null;
  date: number;
}

export interface SettingsRow {
  id: number;
  sitename: string;
  siteurl: string;
  description: string;
  cooldown: number;
  cooldownTime: number;
  paypalEmail: string | null;
  bitcoinAddress: string | null;
  stripePublic: string | null;
  stripeSecret: string | null;
  maintaince: string;
  rotation: number;
  systemType: string;
  maxattacks: number;
  testattacks: number;
  cloudflare: number;
  skype: string | null;
  recaptchaSite: string | null;
  recaptchaSecret: string | null;
  btcAddress: string | null;
}
