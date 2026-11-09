# የአማርኛ እና የወንድ ድምጽ ማብራት (አንድ ጊዜ ብቻ)

ኮዱ ዝግጁ ነው። ድምጹ እንዲሰራ የነጻ Azure Speech ቁልፍ ወደ Netlify መጨመር ብቻ ያስፈልጋል።

1. portal.azure.com ላይ አካውንት ክፈት (ነጻ አካውንት ይበቃል)።
2. "Create a resource" → "Speech" ፈልግ → Create። Pricing tier: **Free F0** ምረጥ (በወር ወደ 500,000 ፊደላት ነጻ)። Region ምረጥ (ለምሳሌ West Europe)።
3. ከተፈጠረ በኋላ "Keys and Endpoint" ክፈት → **KEY 1** እና **Location/Region** (ለምሳሌ `westeurope`) ቅዳ።
4. Netlify → ሳይትህ → Site configuration → Environment variables → ሁለት ጨምር፦
   - `AZURE_SPEECH_KEY` = KEY 1
   - `AZURE_SPEECH_REGION` = region (ለምሳሌ `westeurope`)
5. አዲሱን ዚፕ Netlify ላይ Deploy አድርግ (ወይም Deploys → Trigger deploy)።
6. አፑ ውስጥ ገብተህ መጽሐፍ ክፈት → Listen → "Male voice (online, HD)" ምረጥ → "Test selected voice" ንካ።

ቁልፉ ካልተጨመረ አፑ እንደ ቀድሞው የስልኩን ድምጽ ይጠቀማል (አማርኛ እና ወንድ ድምጽ ግን አይሰሩም)።
