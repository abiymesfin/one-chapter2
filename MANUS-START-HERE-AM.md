# Chapter One V10.10 — ለManus AI መጀመሪያ መመሪያ

1. ከዚህ ZIP ውስጥ ያለውን `chapterone_work` ፕሮጀክት ወደ Manus AI upload አድርግ።
2. `MANUS-PROMPT.md` ክፈት፤ ሙሉ ጽሑፉን Copy አድርገህ Manus ላይ Paste አድርግ።
3. ሁለቱ የማጣቀሻ ምስሎች `assets/` ውስጥ አሉ። `chapter-one-ui-reference.jpg` የምትፈልገው ዲዛይን ነው፤ `chapter-one-logo.png` ደግሞ የላክኸው ሎጎ ነው።
4. Manus የተገናኘውን የGitHub `chapter-one` repository እና የNetlify `one-chapter` site ብቻ እንዲጠቀም አዝዘዋል። አዲስ duplicate site እንዳይፈጥር ተገልጿል።
5. ከመጨረሻው በኋላ Manus የሰጠውን GitHub commit SHA፣ deployment status እና test report አምጣልኝ።

## V10.10 የተጨመሩ ነገሮች
- አዲሱ cream / black design እና የላክኸው logo።
- አራት የbottom navigation አይኮኖች፦ Home, Library/File, Settings, Profile።
- Import Book ላይ Direct Import እና Import & Translate ሁለት አማራጮች።
- Profile → Recently Deleted → Restore / Permanently Delete።
- Settings → Daily Reading Reminder እና Reader Appearance።

**ማስታወሻ:** የDaily Reminder አሁን በbrowser ውስጥ አፕሊኬሽኑ ክፍት ሲሆን ነው የሚሰራው። Chrome ሙሉ በሙሉ ሲዘጋ ለbackground notification የPush service ያስፈልጋል።

**API keys ወደ Manus chat አትላክ።** በNetlify Environment Variables ብቻ መቀመጥ አለባቸው።
