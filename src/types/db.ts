// Shared Prisma row interfaces. These mirror the SQLite schemas under prisma/.
// Keep them in sync if the schema changes.

// ─── main.db ──────────────────────────────────────────────────────────────────

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

export interface LoginRow {
  User: string;
  PW: string;
}

// ─── web.db ───────────────────────────────────────────────────────────────────
// These mirror schema-web.prisma exactly. Some fields use unconventional casing
// or names — that's how the original schema was written.

export interface UserRow {
  ID: number;
  username: string;
  password: string;
  rank: number;
  membership: number;
  expire: number;
  status: number;
  referral: string;
  referralbalance: number;
  testattack: number;
  activity: number;
  twoauth: number;
  referedBy: number;
  login_ip: string | null;
  login_useragent: string | null;
  cark: string | null;
  ban_sbp: string | null;
}

export interface LogRow {
  id: number;
  user: string;
  ip: string;
  time: number;
  method: string;
  postdata: string;
  mode: string;
  ratelimit: string;
  cookie: string;
  date: number;
  chart: string;
  stopped: number;
  handler: string;
  origin: string;
}

export interface LoginLogRow {
  id: number;
  username: string;
  ip: string;
  date: number;
  country: string;
}

export interface PlanRow {
  ID: number;
  name: string;
  vip: number;
  mbt: number;
  unit: string;
  length: number;
  price: number;
  concurrents: number;
  private: number;
}

export interface TicketRow {
  id: number;
  subject: string;
  content: string;
  status: string;
  username: string;
  date: number;
}

export interface MessageRow {
  messageid: number;
  ticketid: number;
  content: string;
  sender: string;
  date: number;
}

export interface PaymentRow {
  ID: number;
  paid: number;
  plan: number;
  user: number;
  email: string;
  tid: string;
  date: number;
}

export interface NewsRow {
  ID: number;
  title: string;
  content: string;
  date: string;
}

export interface GiftCardRow {
  ID: number;
  code: string;
  planID: number;
  claimedby: number;
  dateClaimed: number;
  date: number;
  user: string | null;
}

export interface ServerRow {
  id: number;
  name: string;
  api: string;
  slots: number;
  methods: string;
  vip: number;
}

export interface MethodRow {
  id: number;
  name: string;
  fullname: string;
  type: string;
  command: string;
}

export interface SettingsRow {
  sitename: string;
  stripePubKey: string;
  url: string;
  description: string;
  cooldown: number;
  cooldownTime: number;
  paypal: string;
  bitcoin: string;
  stripe: number;
  maintaince: string;
  rotation: number;
  system: string;
  maxattacks: number;
  testboots: number;
  cloudflare: number;
  skype: string;
  key: string;
  issuerId: string;
  coinpayments: string;
  ipnSecret: string;
  google_site: string;
  google_secret: string;
  btc_address: string;
  secretKey: string;
  cbp: number;
  paypal_email: string;
  theme: string;
  logo: string;
  stripeSecretKey: string;
}
