export type TabsDataType = {
  value: string;
  tabTrigger: string;
  tabHeader: string;
};

export const TABS_DATA: TabsDataType[] = [
  {
    value: 'related',
    tabTrigger: 'Top Related',
    tabHeader: 'Top Related',
  },
  {
    value: 'teaching',
    tabTrigger: 'Teaching My Skills',
    tabHeader: 'People Who Want to Learn What I Teach',
  },
  {
    value: 'learning',
    tabTrigger: 'Has Skills I Want',
    tabHeader: 'People Who Can Teach What I Want to Learn',
  },
];

export const TABS_SEARCH: TabsDataType[] = [
  {
    value: 'learning',
    tabTrigger: 'Teaching',
    tabHeader: 'People Who Teach The Skills',
  },
  {
    value: 'teaching',
    tabTrigger: 'Learning',
    tabHeader: 'People Who Want to Learn The Skills',
  },
];
