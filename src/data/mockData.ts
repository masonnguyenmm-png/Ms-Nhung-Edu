/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Student, RewardItem, Invoice, DiaryPost } from '../types';

export const initialStudents: Student[] = [
  {
    id: '1',
    name: 'Sarah Jenkins',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAtw2WtZ_69Sh-L3Y_kFCAcVW6AzYLBdDpO9PBsf-w6VXo09FR8XwFmP07mT_e3h1ahGe6OQsC2AoJOHlJ0rNzSihjl98Bihusu45prxtkwt6trIzNL0UhzOEg06b8d0Jrx-hK1Ta5zeyxx_BWseQkMcL6ycuFkUppK6bK0QBdPnH2p2j1wzYR411EIM_C8c1Np4AvORTIz0jftVBUBU-G4m_nqluJ2zSXm6rG8BaDEYp_CrVQ2KRBesmlNd_xfSLKcl2BAp88KF2I',
    grade: 94,
    stars: 120,
    status: 'Present',
    isPresent: true,
    seatId: 'A1',
    classId: 'Period 3: Biology'
  },
  {
    id: '2',
    name: 'Marcus Ray',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC98Z93-qB3KLo9B1usbEmKDfVt5uta8eRZyBABECTmUTKS44bB1PI0PL0nwxUJUl91AtKQT29YNdiKikk3dtTHE2bviuPp3rP4TSK3U59-mmFF_YZ-PraTOsVb2GdbwloKmTZB3ICdUmO4Ga35eMXSri-bRbYPYE8ERkWbA1vCI5stB1UoWxqFR99vhMYqOgkojB9TbC2g2C6_fv-nmvbdUrdU_URJgnyvtEFugPWQ1GY36xjHVt_A84RTNc3BJtLmErDZycpYFoQ',
    grade: 88,
    stars: 80,
    status: 'Participating',
    isPresent: true,
    seatId: 'A2',
    classId: 'Period 3: Biology'
  },
  {
    id: '3',
    name: 'Elena Diaz',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDNsmtSBaI9OOTdOJ6XralhpIVGapf0qxgkVbXky16apJEbyGEg8QV87JhHTOXEPmdChGIscmyrDBowYxhWDYCEmJFUUq6MReofD7DdY0eI8Wu89aGthSk9t-CCpaPbhR_5zQdjHIXBnpwMDy926cb_BbwNOH1eLM1LPZg1fxaR0R-MecdLKZTHawHOu4u-2X7fEepXFVcX9l8q3WcJ_Y-kBk8JSke6rgQJA5nP2Kg1d08DXtbFKC-88SctUiew7yXyo5EwH-12RmE',
    grade: 75,
    stars: 15,
    status: 'Absent',
    isPresent: false,
    seatId: 'B1',
    classId: 'Period 3: Biology'
  },
  {
    id: '4',
    name: 'Alex Rivera',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCyaePMFtdwm3yG0Wrl_s04MaVLPPiQsxU_3sCG6PEd0ooZhO--tmhU0ZzuHVkpwdfYuIYijGMWSfWoSP8pt3UKc2jp_Fw05-MmNcEz-HUBd0cWLwno9Lx-ppFBzuVoFzh38LoInZU4NOitrh1sXLvH02dh9TqxTvyhUqJ1r6jOrxUdPeWFR7HDFSRQ0ZihK1DQ-vESyaN-CRdGxVT2CQgNIbqCUIMkicXvLpWEUMmuiIayNUz2E6Du4ptU5Gz4HjjMbmOabzED-xU',
    grade: 98,
    stars: 150,
    status: 'Present',
    isPresent: true,
    seatId: 'B2',
    classId: 'Period 3: Biology'
  },
  {
    id: '5',
    name: 'Jordan Chen',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBuDGFuFlZZOkIevBx3y-8A7chjmu8Y9Hu5Pwmv0A0veH8aZAyZIudjNfHjvvMuLSQC_ms8rOL2a1MooN2enR4GQwahYBsQxa-mwHJZPb3QZjzvIJkPaNRwddQAv8mG_NFerpsQ2opMdf6F1FPRathze_nfifeW7e50ICK0E4WpGa0zSG6WRjFRRzJSbas5QNX4f-07LZKsX7YMiPf0wreOUf-t06eQ7GKSNDEffS6DrVg9epx-pmcp5i52IWfcDQgQAymCkaAlIt4',
    grade: 64,
    stars: 5,
    status: 'Absent',
    isPresent: false,
    consecutiveAbsences: 3,
    seatId: 'C1',
    classId: 'Advanced Physics 301'
  },
  {
    id: '6',
    name: 'Samira Patel',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC2m_dScDC4ObthXJueBTvWzSpK201Y_pIO2q7lx0puXuIdkBWyAQcLAusHCzOiSK1yoDscY6ziSXjacA7ObLdw4mdc7_xFipSn14RFAC9l4SlQehmHmAmcn2tOTG-tGNxWrwvxz-3c65xin1Dm47Fg5R8G9CbkBDXHmlSzVBhjWT4TvTwDZyha_gwfpDOzPfPZsi_Rb0DAgt8tFu2Tirlm7i6xI7isKcyZpgGjiVxGngELZ6dxjSKRVaY9DhEXAEVYWwn_pgo5U2Y',
    grade: 85,
    stars: 45,
    status: 'Late',
    isPresent: true,
    seatId: 'C2',
    classId: 'Advanced Physics 301'
  },
  {
    id: '7',
    name: 'Julian Alvarez',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuASFW8j4RQ7gwPCcNqVbzAfz8HbdrYAMFEt2HtO3p4poCB1M8xnzujDlf9Y0UkUXPwFtxufminA1zdIMgfQjYghvyzt9cxcSegSKq3dsOzUamqy7swsJXvqq1XnDw2LMQZXPAZBdsn0D7B69j-NSGKPdFwqGWQNvGCa0v1TttTfMJSYpZZ2_5exornIL2_9kmLMkExyE3HBL8olvz8a4XfGeYKBZhNyNLCAtq4fm6kugzA6QkcfFSNpOgP2vyAB5wGMo7D0kL6A2IE',
    grade: 99,
    stars: 420,
    status: 'Present',
    isPresent: true,
    seatId: 'D1',
    classId: 'Advanced Physics 301'
  },
  {
    id: '8',
    name: 'Elena Rodriguez',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAov8bgR3JBVErR3n-xptYrqzyoRcxW87rX2oE2FJjv2lZViNWFKMhEOHhSLx1U7eYrfiz_tCeM75xsyL5UwbUgnOUsL6m9ZS8-QFQMbQmhHN5nYOUrDIeLkaB-LHdq72B7hTq9vZoBV95-kNeHGxXB5ZdoO1jdbXtv9WkWS1woWW_FC4sU1mEAgimUxEDLscx2eCJyqS3IP6Vwi9pKCRmgG5b-AvLBN4DAdhcZ8H6KKG3f2zdpGuuLdpgiPQd-FTayXiFHQ5agQQY',
    grade: 95,
    stars: 385,
    status: 'Present',
    isPresent: true,
    seatId: 'D2',
    classId: 'Advanced Physics 301'
  },
  {
    id: '9',
    name: 'Leo Mercer',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC9jg-n_mUWHAJQaZv54XiI5t_dPIw1Tyow7BdT6tWybM7gCJfD0opirfYsJiUjOZpA2YGTqGAWyRRneaActb37h0LfopMYJvFyLtXrjv7Rty1xGDlS0WAY6nKizwubUOP_T_SJNeNHdPKEn1njxmm2zgbeYB9c3rZKN7ClIYIS78CGMAj2Zla_w2xJtzCIyTPmDUEKp4W5d6RMs5ARJdy5R109gnZpEDcnZDbI_l9i81oEpIVm2p7whjbm3d3e1ZpIX0_TeBn6uqQ',
    grade: 92,
    stars: 230,
    status: 'Present',
    isPresent: true,
    seatId: 'E1',
    classId: 'Starfish 1A'
  },
  {
    id: '10',
    name: 'Emma Watson',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBmOvncMLLyRYYoPgOFCGaqcSNaX2_Deiyz7StLLe7NmZxAgzL4lrA-zLpc64stF7taXrGK4qavXiHZ7vdiwmIIZdKfAwX7hWupw3BHATK_A9fL-pAHcVPlz7dLUoRoOGmPfd8ehK6WFqSGb6colW9oZDRgC4AVGnhTJIxJUiYaTigkxtLD8QETg0pm3pZ3QVYOL_F5FIfnYOlsKSkGdeqSoHU9-OdxmvjejXRj2q3yXpcttwKJRZd1u_M8Z1MN7cZMIegUxid6JFQ',
    grade: 96,
    stars: 250,
    status: 'Present',
    isPresent: true,
    seatId: 'E2',
    classId: 'Starfish 1A'
  },
  {
    id: '11',
    name: 'Lucas Rivas',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCi1U0QXOs8DRnyOYat4ovC8Eu0OSenjWBfVOibtTYtygup1OoLXLqSTEjmU0POr3iftI0ZgMY4WlwL53Ou1wOVmnUJYyMfywRfMOivnUHa6qKswjPBBlN3L85vzuPC2yrQVd-Q2dPtncGoBDbL9Q90Y4GxtWjnouDqFeBYpNEJop03-Y3pk-qoyErSB5j9qyLfhBFDfUmbukfgSg_tHdOOz_GGhB2gjL3wSeSVvDN8FzC2v4Nafm3410yIAyBAC6uczxS1WMC40b0',
    grade: 84,
    stars: 42,
    status: 'Present',
    isPresent: true,
    seatId: 'F1',
    classId: 'Starfish 1A'
  },
  {
    id: '12',
    name: 'Mia Kallis',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC13rkhfZNfrV72O-p2Tw_eZ17fA_YD7ajI5J8HqqEYflWJ0uwygxLRm4aXgKZTKP_5nnvTWVh0IN8la_iE5yYnU4oKZM-5gl9L2Y8IKr-T0CVW4AYtJEeqdoQepl1L0p48A7BdxLbUXnReGeU_pjtNk7Y-IDgylKhEYP2Ovhk4UFP7Ufsb3w3Sp-eoCfLLRrt7tkp8ycdYIpXJsYkFIt78SEFtf079O5dCENzTWoxPvVFGSgja2FBe9nhUONCY2lgOtTxgWX5Fq7o',
    grade: 91,
    stars: 55,
    status: 'Present',
    isPresent: true,
    seatId: 'F2',
    classId: 'Starfish 1A'
  }
];

export const initialRewards: RewardItem[] = [
  {
    id: 'rew-1',
    title: 'Listen to Music',
    description: 'Earn the privilege to listen to your own music during independent study time for one full period.',
    cost: 50,
    icon: 'Music',
    category: 'Classroom Perks',
    popular: true
  },
  {
    id: 'rew-2',
    title: 'Homework Pass',
    description: 'Skip one standard homework assignment without penalty. Cannot be used on major projects or exams.',
    cost: 120,
    icon: 'FileText',
    category: 'Academic Bonuses',
    popular: true,
    premium: true
  },
  {
    id: 'rew-3',
    title: 'Choose Your Seat',
    description: 'Pick any available seat in the classroom for an entire week. Subject to instructor final approval.',
    cost: 80,
    icon: 'Compass',
    category: 'Classroom Perks'
  },
  {
    id: 'rew-4',
    title: 'Neon Gel Pen Set',
    description: 'Vibrant 12-pack of smooth-flowing neon gel pens. Perfect for detailed diagrams and colorful journals.',
    cost: 50,
    icon: 'PenTool',
    category: 'Physical Items',
    popular: true
  },
  {
    id: 'rew-5',
    title: 'Moleskine Notebook',
    description: 'Premium hardcover dotted journal notebook. Standard-issue for high-end sketchbooks or bullet logs.',
    cost: 120,
    icon: 'BookOpen',
    category: 'Physical Items',
    premium: true
  },
  {
    id: 'rew-6',
    title: 'Tech-Commuter Backpack',
    description: 'Water-resistant compartments, dedicated padded shockproof sleeve fits laptops up to 15.6 inches.',
    cost: 250,
    icon: 'Package',
    category: 'Physical Items',
    premium: true
  }
];

export const initialInvoices: Invoice[] = [
  {
    id: '#INV-2026-089',
    date: 'May 01, 2026',
    amount: 450.00,
    status: 'Paid'
  },
  {
    id: '#INV-2026-072',
    date: 'Apr 01, 2026',
    amount: 450.00,
    status: 'Paid'
  },
  {
    id: '#INV-2026-055',
    date: 'Mar 01, 2026',
    amount: 450.00,
    status: 'Paid'
  }
];

export const initialDiaryPosts: DiaryPost[] = [
  {
    id: 'dp-1',
    date: 'Today',
    time: '9:30 AM',
    subject: 'Language Arts',
    topic: 'Family & Friends 🏠',
    title: 'Descriptive Writing Circles',
    content: 'Today we learned about different structures of social groups and shared stories about our own backgrounds. We practiced writing fully descriptive sentences about our favorite collaborative activities in our journals.',
    tags: ['writing', 'dialogue', 'storytelling'],
    homework: [
      { id: 'hw-1-1', text: 'Read Chapter 4 of "The Great Odyssey" and summarize characters.', completed: false },
      { id: 'hw-1-2', text: 'Write 3 compound descriptive sentences referencing family recipes.', completed: true }
    ],
    // Let's use high quality image placeholders of students or classrooms
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAuxa4cnXgUEi2Aw5wPGcOQCVge0XKV42eWHCh6Z_G0dwqjOUYWomqsokuVqumG9SrJyPqUffiyZUC7PgHH2aKQdfFak1yEup_M3X8BdA-LX925wzp7KuxEBGI4YUiRiKiXUMdROU0e8wtLn2EIduNnMPchK0-wiEj8o30feya2Snbd2YcZriifoycfH_zlUzmKIGgwuRN72wCQ_76AOTvapNMulHJH0ly_DURKJ2F7X4QvV_YctB28ZDV2jZsq36GUpd2VDxITBWA',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCvMGPpNktGZBQ7Kmh9VhmkesvBZTKPbHcn-D26DsZ-oRkcZWgnsWdkS46qoWZ0wtpq_uP9GfIeqHkjgjN4xEzWkWOMGTXsTQJLnLbRNhgj3SY6j3F3DdUuFhEnfZEpnTlqGopy5cqvmBt7RM1xyMubUccOv8yR11-b5oQl2XNiqhpY_d2pA3O0mY0_FNZkT7UudlrW_U4MtCkSVS36hSv4woOYdi8DfSSPS3KpHlB2MRV2mBK_ML4OpngPye-voH3dNwZfCGorYSY'
    ]
  },
  {
    id: 'dp-2',
    date: 'Yesterday',
    time: '11:15 AM',
    subject: 'Mathematics',
    topic: 'Fractions 🍕',
    title: 'Visual Representation of Ratios',
    content: 'Introduced basic ratios and mixed fractional integers using visual slice components. We practiced dividing multi-dimensional matrices and recognizing proper, improper and decimal conversions.',
    tags: ['ratios', 'fractions', 'math-matrices'],
    homework: [
      { id: 'hw-2-1', text: 'Complete Fractions conversion packet sections A through C.', completed: false }
    ],
    pdf: { name: 'Fractions_Ratio_Worksheet.pdf', size: '1.4 MB' }
  }
];
