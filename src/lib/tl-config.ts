export interface StrandConfig {
  checkboxName: string;
  label: string;
  tooltip: string;
  domainColumn: string;
  cssClass: string;
}

export interface TLConfig {
  id: string;
  title: string;
  description: string;
  domainColumns: string[];
  strands: StrandConfig[];
}

export const tlConfigs: Record<string, TLConfig> = {
  tl1: {
    id: 'tl1',
    title: 'TL1: Knowing Our Students',
    description: '',
    domainColumns: ['R', 'TP', 'MT', 'AR'],
    strands: [
      {
        checkboxName: 's1',
        label: 'Relationships',
        tooltip: 'Teacher/student relationships are proactive and positive.',
        domainColumn: 'R',
        cssClass: 'n1',
      },
      {
        checkboxName: 's2',
        label: 'Teacher Planning',
        tooltip:
          "Teacher planning is driven by knowledge of each student's next steps for learning.",
        domainColumn: 'TP',
        cssClass: 'n2',
      },
      {
        checkboxName: 's3',
        label: 'Modify their Teaching',
        tooltip:
          'Teachers modify their teaching based on what students need to succeed.',
        domainColumn: 'MT',
        cssClass: 'n3',
      },
      {
        checkboxName: 's4',
        label: 'Achieve Readiness',
        tooltip:
          'Teachers achieve readiness for learning by constructing tasks or offering learning choices at different levels of complexity.',
        domainColumn: 'AR',
        cssClass: 'n4',
      },
    ],
  },
  tl2: {
    id: 'tl2',
    title: 'TL2: Strategies for Learning',
    description: '',
    domainColumns: ['U', 'MDL', 'RA', 'RoTech', 'LS'],
    strands: [
      {
        checkboxName: 's1',
        label: 'Understanding',
        tooltip:
          'Teachers support students in developing a deep understanding of key concepts.',
        domainColumn: 'U',
        cssClass: 'n1',
      },
      {
        checkboxName: 's2',
        label: 'Multi-dimensional Learning',
        tooltip:
          'Teachers support students in demonstrating their learning in multiple ways.',
        domainColumn: 'MDL',
        cssClass: 'n2',
      },
      {
        checkboxName: 's3',
        label: 'Reasoned Arguments',
        tooltip:
          'Teachers support students in constructing reasoned arguments.',
        domainColumn: 'RA',
        cssClass: 'n3',
      },
      {
        checkboxName: 's4',
        label: 'Repertoire of Techniques',
        tooltip:
          'Teachers support students in developing a repertoire of techniques.',
        domainColumn: 'RoTech',
        cssClass: 'n4',
      },
      {
        checkboxName: 's5',
        label: 'Learning Spaces',
        tooltip:
          'Teachers support students in using learning spaces effectively.',
        domainColumn: 'LS',
        cssClass: 'n5',
      },
    ],
  },
  tl3: {
    id: 'tl3',
    title: 'TL3: Evidence for Learning',
    description: '',
    domainColumns: ['RoThink', 'EoST', 'EF'],
    strands: [
      {
        checkboxName: 's1',
        label: 'Reflect on Thinking',
        tooltip:
          'Teachers support students in reflecting on their thinking.',
        domainColumn: 'RoThink',
        cssClass: 'n1',
      },
      {
        checkboxName: 's2',
        label: 'Evidence of Student Learning',
        tooltip:
          'Teachers use evidence of student learning to inform instruction.',
        domainColumn: 'EoST',
        cssClass: 'n2',
      },
      {
        checkboxName: 's3',
        label: 'Employ Feedback',
        tooltip: 'Teachers employ feedback to guide student learning.',
        domainColumn: 'EF',
        cssClass: 'n3',
      },
    ],
  },
  tl4: {
    id: 'tl4',
    title: 'TL4: Crafting the Curriculum',
    description: '',
    domainColumns: ['RTE', 'DLoI', 'RaAoC'],
    strands: [
      {
        checkboxName: 's1',
        label: 'Risk-taking Environment',
        tooltip: 'Teachers create a risk-taking environment for learning.',
        domainColumn: 'RTE',
        cssClass: 'n1',
      },
      {
        checkboxName: 's2',
        label: 'Deepening Lines of Inquiry',
        tooltip:
          'Teachers support students in deepening lines of inquiry.',
        domainColumn: 'DLoI',
        cssClass: 'n2',
      },
      {
        checkboxName: 's3',
        label: 'Responsibility and Citizenship',
        tooltip:
          'Teachers support students in developing responsibility and aspects of citizenship.',
        domainColumn: 'RaAoC',
        cssClass: 'n3',
      },
    ],
  },
};