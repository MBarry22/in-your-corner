/**
 * Curated real resources for alcohol recovery support. 100+ verified URLs.
 * AI picks 2–3 by id daily; we attach these URLs when displaying.
 */
export const RECOVERY_RESOURCES: { id: string; title: string; url: string }[] = [
  // === Helplines & crisis (Canada & US) ===
  { id: "crisis-canada", title: "Canada Crisis Line (24/7)", url: "https://www.crisisservicescanada.ca/" },
  { id: "211", title: "211 Canada – Community Resources", url: "https://211.ca/" },
  { id: "samhsa-helpline", title: "SAMHSA National Helpline (24/7)", url: "https://www.samhsa.gov/find-help/national-helpline" },
  { id: "samhsa-find-help", title: "SAMHSA Find Help & Treatment", url: "https://www.samhsa.gov/find-help" },
  { id: "samhsa-crisis", title: "SAMHSA – In Crisis", url: "https://www.samhsa.gov/find-support/in-crisis" },
  { id: "findtreatment", title: "FindTreatment.gov (US)", url: "https://findtreatment.gov/" },
  { id: "alberta-211", title: "Alberta 211", url: "https://ab.211.ca/" },
  { id: "bc-crisis", title: "BC Crisis Line", url: "https://crisiscentre.bc.ca/" },
  { id: "ontario-drug-helpline", title: "Ontario Drug & Alcohol Helpline", url: "https://www.connexontario.ca/" },
  { id: "talk4healing", title: "Talk4Healing (Indigenous women ON)", url: "https://www.talk4healing.com/" },
  { id: "hope-wellness", title: "Hope for Wellness (Indigenous)", url: "https://www.hopeforwellness.ca/" },
  { id: "kids-help-phone", title: "Kids Help Phone (Canada)", url: "https://kidshelpphone.ca/" },
  { id: "nami-helpline", title: "NAMI Helpline (US)", url: "https://www.nami.org/help" },
  { id: "988", title: "988 Suicide & Crisis Lifeline (US)", url: "https://988lifeline.org/" },

  // === AA & 12-step ===
  { id: "aa", title: "Alcoholics Anonymous (AA)", url: "https://www.aa.org/" },
  { id: "aa-canada", title: "AA Around the World", url: "https://www.aa.org/aa-around-the-world" },
  { id: "aa-meetings", title: "Find AA Meetings", url: "https://www.aa.org/find-aa" },
  { id: "aa-literature", title: "AA Literature & Books", url: "https://www.aa.org/aa-literature" },
  { id: "aa-online", title: "AA Online Meetings", url: "https://www.aa.org/meeting-guide-app" },
  { id: "aa-big-book", title: "AA Big Book", url: "https://www.aa.org/the-big-book" },
  { id: "aa-12-steps", title: "AA Twelve Steps", url: "https://www.aa.org/the-twelve-steps" },
  { id: "aa-12-traditions", title: "AA Twelve Traditions", url: "https://www.aa.org/the-twelve-traditions" },
  { id: "al-anon", title: "Al-Anon (family & friends)", url: "https://al-anon.org/" },
  { id: "alateen", title: "Alateen", url: "https://al-anon.org/alateen/" },
  { id: "na", title: "Narcotics Anonymous", url: "https://www.na.org/" },
  { id: "ca", title: "Cocaine Anonymous", url: "https://ca.org/" },

  // === SMART, secular & alternatives ===
  { id: "smart", title: "SMART Recovery", url: "https://www.smartrecovery.org/" },
  { id: "smart-canada", title: "SMART Recovery Canada", url: "https://smartrecovery-canada.ca/" },
  { id: "smart-meetings", title: "SMART Recovery Meetings", url: "https://www.smartrecovery.org/smart-recovery-toolbox/" },
  { id: "lifering", title: "LifeRing Secular Recovery", url: "https://www.lifering.org/" },
  { id: "women-sobriety", title: "Women for Sobriety", url: "https://womenforsobriety.org/" },
  { id: "moderation", title: "Moderation Management", url: "https://moderation.org/" },
  { id: "sos", title: "Secular Organizations for Sobriety", url: "https://www.sossobriety.org/" },
  { id: "refuge-recovery", title: "Refuge Recovery", url: "https://www.refugerecovery.org/" },
  { id: "recovery-dharma", title: "Recovery Dharma", url: "https://www.recoverydharma.org/" },

  // === NIAAA – treatment & navigator ===
  { id: "niaaa-navigator", title: "NIAAA Alcohol Treatment Navigator", url: "https://alcoholtreatment.niaaa.nih.gov/" },
  { id: "niaaa-treatment-guide", title: "NIAAA Finding and Getting Help", url: "https://www.niaaa.nih.gov/publications/brochures-and-fact-sheets/treatment-alcohol-problems-finding-and-getting-help" },
  { id: "niaaa-longterm", title: "Long-term Recovery Support (NIAAA)", url: "https://alcoholtreatment.niaaa.nih.gov/support-through-the-process/long-term-recovery-support" },
  { id: "niaaa-support-process", title: "Support Through the Process (NIAAA)", url: "https://alcoholtreatment.niaaa.nih.gov/support-through-the-process" },
  { id: "rethinking-drinking", title: "Rethinking Drinking (NIAAA)", url: "https://www.rethinkingdrinking.niaaa.nih.gov/" },
  { id: "rethinking-support", title: "Support Strategies for Quitting (NIAAA)", url: "https://www.rethinkingdrinking.niaaa.nih.gov/thinking-about-change/support-strategies-quitting" },
  { id: "rethinking-mutual", title: "Mutual Support Groups (NIAAA)", url: "https://www.rethinkingdrinking.niaaa.nih.gov/thinking-about-change/mutual-support-groups" },
  { id: "niaaa-marathon", title: "Recovery: Marathon Not a Sprint (NIAAA)", url: "https://www.niaaa.nih.gov/health-professionals-communities/core-resource-on-alcohol/support-recovery-its-marathon-not-sprint" },
  { id: "niaaa-telehealth", title: "Telehealth Options (NIAAA)", url: "https://www.niaaa.nih.gov/publications/telehealth-options-alcohol-treatment" },

  // === NIAAA – education & fact sheets ===
  { id: "niaaa-aud-basics", title: "Understanding Alcohol Use Disorder (NIAAA)", url: "https://www.niaaa.nih.gov/publications/brochures-and-fact-sheets/understanding-alcohol-use-disorder" },
  { id: "niaaa-effects-health", title: "Alcohol and Your Health (NIAAA)", url: "https://www.niaaa.nih.gov/alcohols-effects-health" },
  { id: "niaaa-topics-az", title: "Alcohol Topics A–Z (NIAAA)", url: "https://www.niaaa.nih.gov/alcohols-effects-health/alcohol-topics-a-to-z" },
  { id: "niaaa-facts-stats", title: "Alcohol Facts and Statistics (NIAAA)", url: "https://www.niaaa.nih.gov/alcohols-effects-health/alcohol-topics/alcohol-facts-and-statistics" },
  { id: "niaaa-adolescent", title: "Alcohol and the Adolescent Brain (NIAAA)", url: "https://www.niaaa.nih.gov/publications/brochures-and-fact-sheets/alcohol-and-adolescent-brain" },
  { id: "niaaa-sleep", title: "Alcohol and Sleep (NIAAA)", url: "https://www.niaaa.nih.gov/alcohols-effects-health/alcohol-and-sleep" },
  { id: "niaaa-stress", title: "Alcohol and Stress (NIAAA)", url: "https://www.niaaa.nih.gov/publications/brochures-and-fact-sheets/alcohol-and-stress" },
  { id: "niaaa-medications", title: "Mixing Alcohol with Medicines (NIAAA)", url: "https://www.niaaa.nih.gov/publications/brochures-and-fact-sheets/harmful-interactions-mixing-alcohol-with-medicines" },
  { id: "niaaa-overdose", title: "Alcohol Overdose (NIAAA)", url: "https://www.niaaa.nih.gov/publications/brochures-and-fact-sheets/understanding-dangers-of-alcohol-overdose" },
  { id: "niaaa-college", title: "College Drinking (NIAAA)", url: "https://www.collegedrinkingprevention.gov/" },
  { id: "niaaa-older-adults", title: "Alcohol and Older Adults (NIAAA)", url: "https://www.niaaa.nih.gov/publications/brochures-and-fact-sheets/alcohol-and-older-adults" },
  { id: "niaaa-women", title: "Alcohol and Women (NIAAA)", url: "https://www.niaaa.nih.gov/publications/brochures-and-fact-sheets/women-and-alcohol" },
  { id: "niaaa-publications", title: "NIAAA Publications", url: "https://www.niaaa.nih.gov/publications" },

  // === SAMHSA ===
  { id: "samhsa-treatment", title: "SAMHSA Treatment Locator", url: "https://findtreatment.gov/" },
  { id: "samhsa-alcohol", title: "SAMHSA Alcohol Use", url: "https://www.samhsa.gov/find-help/atod/alcohol" },
  { id: "samhsa-recovery", title: "SAMHSA Recovery and Recovery Support", url: "https://www.samhsa.gov/find-help/recovery" },
  { id: "samhsa-bhrc", title: "SAMHSA Behavioral Health Treatment", url: "https://www.samhsa.gov/find-help/treatment" },
  { id: "samhsa-tips", title: "SAMHSA Tips for Talking", url: "https://www.samhsa.gov/talk-they-hear-you" },

  // === Government – Canada ===
  { id: "health-canada", title: "Health Canada – Substance Use", url: "https://www.canada.ca/en/health-canada/services/substance-use.html" },
  { id: "ccsa", title: "Canadian Centre on Substance Use", url: "https://www.ccsa.ca/" },
  { id: "canada-drugs", title: "Canada.ca – Drugs", url: "https://www.canada.ca/en/health-canada/services/drugs-medication.html" },
  { id: "wellness-together", title: "Wellness Together Canada", url: "https://www.wellnesstogether.ca/" },

  // === Government – US ===
  { id: "cdc-alcohol", title: "CDC Alcohol Use", url: "https://www.cdc.gov/alcohol/index.htm" },
  { id: "cdc-factsheet", title: "CDC Alcohol Fact Sheet", url: "https://www.cdc.gov/alcohol/fact-sheets/alcohol-use.htm" },
  { id: "nida", title: "NIDA Drug Use & Addiction", url: "https://nida.nih.gov/" },
  { id: "va-substance", title: "VA Substance Use", url: "https://www.mentalhealth.va.gov/substance-use/index.asp" },

  // === Treatment & rehabs (main pages) ===
  { id: "hazelden-betty-ford", title: "Hazelden Betty Ford", url: "https://www.hazeldenbettyford.org/" },
  { id: "hazelden-articles", title: "Hazelden Betty Ford Articles", url: "https://www.hazeldenbettyford.org/articles" },
  { id: "addiction-center", title: "American Addiction Centers", url: "https://americanaddictioncenters.org/" },
  { id: "addiction-center-guide", title: "AAC Rehab Guide", url: "https://americanaddictioncenters.org/rehab-guide" },
  { id: "positive-recovery", title: "Positive Recovery", url: "https://positiverecovery.com/" },
  { id: "choose-horizon", title: "Choose Your Horizon", url: "https://www.chooseyourhorizon.com/" },
  { id: "shatterproof", title: "Shatterproof", url: "https://www.shatterproof.org/" },
  { id: "faces-voices", title: "Faces & Voices of Recovery", url: "https://facesandvoicesofrecovery.org/" },
  { id: "recovery-centers", title: "Recovery Centers of America", url: "https://recoverycentersofamerica.com/" },

  // === Books & reading ===
  { id: "aa-big-book-online", title: "AA Big Book (read)", url: "https://www.aa.org/the-big-book" },
  { id: "aa-daily-reflection", title: "AA Daily Reflections", url: "https://www.aa.org/daily-reflections" },
  { id: "niaaa-books", title: "NIAAA Brochures", url: "https://www.niaaa.nih.gov/publications/brochures-and-fact-sheets" },
  { id: "samhsa-store", title: "SAMHSA Store (free materials)", url: "https://store.samhsa.gov/" },

  // === Special populations ===
  { id: "va-resources", title: "VA Addiction Resources", url: "https://www.mentalhealth.va.gov/substance-use/index.asp" },
  { id: "lgbtq-recovery", title: "LGBTQ+ Recovery (SAMHSA)", url: "https://www.samhsa.gov/behavioral-health-equity/lgbtqi" },
  { id: "native-connections", title: "Native Connections (SAMHSA)", url: "https://www.samhsa.gov/tribal-ttac" },
  { id: "youth-gov", title: "Youth.gov – Substance Use", url: "https://youth.gov/youth-topics/substance-abuse" },

  // === Apps & tools ===
  { id: "aa-meeting-guide", title: "AA Meeting Guide App", url: "https://www.aa.org/meeting-guide-app" },
  { id: "rethinking-tools", title: "Rethinking Drinking Tools", url: "https://www.rethinkingdrinking.niaaa.nih.gov/tools/resources.asp" },
  { id: "checkup-choices", title: "CheckUp & Choices (online)", url: "https://checkupandchoices.com/" },

  // === Podcasts & media (main sites) ===
  { id: "recovery-elevator", title: "Recovery Elevator", url: "https://recoveryelevator.com/" },
  { id: "sober-cast", title: "Sober Cast (AA)", url: "https://sobercast.com/" },
  { id: "dax-shepard", title: "Armchair Expert (recovery)", url: "https://armchairexpertpod.com/" },

  // === More support & community ===
  { id: "intherooms", title: "In The Rooms (online meetings)", url: "https://www.intherooms.com/" },
  { id: "sober-grid", title: "Sober Grid", url: "https://www.sobergrid.com/" },
  { id: "loosid", title: "Loosid (sober social)", url: "https://www.loosid.com/" },
  { id: "tempest", title: "The Tempest (sobriety)", url: "https://www.jointempest.com/" },
  { id: "soberistas", title: "Soberistas", url: "https://soberistas.com/" },
  { id: "club-soda", title: "Club Soda (mindful drinking)", url: "https://joinclubsoda.com/" },
  { id: "one-year-no-beer", title: "One Year No Beer", url: "https://www.oneyearnobeer.com/" },
  { id: "sober-movement", title: "The Sober Movement", url: "https://thesobermovement.com/" },

  // === Research & evidence ===
  { id: "niaaa-research", title: "NIAAA Research", url: "https://www.niaaa.nih.gov/research" },
  { id: "ccsa-resources", title: "CCSA Resources", url: "https://www.ccsa.ca/resources" },
  { id: "who-alcohol", title: "WHO Alcohol", url: "https://www.who.int/health-topics/alcohol" },
  { id: "mayo-alcohol", title: "Mayo Clinic – Alcohol Use", url: "https://www.mayoclinic.org/diseases-conditions/alcohol-use-disorder/symptoms-causes/syc-20369243" },
  { id: "cleveland-clinic", title: "Cleveland Clinic – Alcohol", url: "https://my.clevelandclinic.org/health/diseases/3909-alcoholism" },

  // === Provincial / regional Canada ===
  { id: "ab-health-addictions", title: "Alberta Addiction Services", url: "https://www.alberta.ca/addictions-mental-health.aspx" },
  { id: "bc-mental-health", title: "BC Mental Health & Substance Use", url: "https://www2.gov.bc.ca/gov/content/health/managing-your-health/mental-health-substance-use" },
  { id: "on-addictions", title: "Ontario Addiction Services", url: "https://www.ontario.ca/page/get-help-problem-gambling-alcohol-or-drugs" },
  { id: "qc-dependance", title: "Quebec – Dependence", url: "https://www.quebec.ca/sante/problemes-de-sante/sante-mentale/dependances" },
  { id: "sk-health-alcohol", title: "Saskatchewan Alcohol Services", url: "https://www.saskatchewan.ca/residents/health/accessing-health-care-services/addictions-services" },
  { id: "mb-addictions", title: "Manitoba Addictions", url: "https://www.gov.mb.ca/health/addictions/index.html" },

  // === Mindfulness & wellness (recovery-adjacent) ===
  { id: "headspace", title: "Headspace (mindfulness)", url: "https://www.headspace.com/" },
  { id: "calm", title: "Calm (meditation)", url: "https://www.calm.com/" },
  { id: "mindful-org", title: "Mindful.org", url: "https://www.mindful.org/" },
  { id: "gratitude-app", title: "Gratitude & Journaling", url: "https://www.getpresentapp.com/" },

  // === Additional orgs ===
  { id: "nacoa", title: "NACoA (children of alcoholics)", url: "https://nacoa.org/" },
  { id: "adac", title: "Association of Recovery Community Organizations", url: "https://facesandvoicesofrecovery.org/arco/" },
  { id: "young-people-recovery", title: "Young People in Recovery", url: "https://youngpeopleinrecovery.org/" },
  { id: "she-recovers", title: "She Recovers", url: "https://sherecovers.org/" },
  { id: "red-recovery", title: "Red Road to Recovery", url: "https://www.redroadrecovery.com/" },
  { id: "musicians-assistance", title: "MusiCares (musicians)", url: "https://www.grammy.com/musicares" },
  { id: "physician-health", title: "Physician Health Programs", url: "https://www.fsmb.org/advocacy/policy-resources/physician-health/" },
  { id: "lawyers-assistance", title: "Lawyers Assistance Programs", url: "https://www.americanbar.org/groups/lawyer_assistance/" },

  // === Family impact & supporting loved ones ===
  { id: "al-anon-family", title: "Al-Anon – For Family & Friends", url: "https://al-anon.org/for-members/meeting-resources/" },
  { id: "al-anon-what", title: "Al-Anon – What Is Al-Anon", url: "https://al-anon.org/al-anon-meetings/what-is-al-anon-and-alateen/" },
  { id: "nacoa-kids", title: "NACoA – Children of Alcoholics", url: "https://nacoa.org/get-help/" },
  { id: "samhsa-family", title: "SAMHSA – Family & Caregivers", url: "https://www.samhsa.gov/find-help/family-friends" },
  { id: "niaaa-family", title: "NIAAA – Helping Someone with AUD", url: "https://www.niaaa.nih.gov/publications/brochures-and-fact-sheets/treatment-alcohol-problems-finding-and-getting-help" },
  { id: "ccsa-family", title: "CCSA – Family & Community", url: "https://www.ccsa.ca/family-and-community" },
  { id: "addiction-family", title: "How Addiction Affects Families (AAC)", url: "https://americanaddictioncenters.org/recovery-guide/addiction-and-family" },
  { id: "soberlink-blog", title: "Soberlink – Recovery & Family Blog", url: "https://www.soberlink.com/addiction-recovery-blog" },
  { id: "hazelden-family", title: "Hazelden – Family Program", url: "https://www.hazeldenbettyford.org/treatment/family-program" },
  { id: "partnership-families", title: "Partnership – Supporting Families", url: "https://drugfree.org/parent-blog/" },
  { id: "recovery-village-family", title: "Recovery Village – Family Resources", url: "https://www.therecoveryvillage.com/family/" },
  { id: "psychology-today-addiction", title: "Psychology Today – Addiction", url: "https://www.psychologytoday.com/us/basics/addiction" },
  { id: "helpguide-alcohol", title: "HelpGuide – Alcohol & Substance Use", url: "https://www.helpguide.org/home-pages/substance-abuse-addiction.htm" },
  { id: "webmd-alcohol", title: "WebMD – Alcohol Use Disorder", url: "https://www.webmd.com/mental-health/addiction/alcohol-use-disorder" },
  { id: "healthline-alcohol", title: "Healthline – Alcohol & Health", url: "https://www.healthline.com/health/alcohol" },

  // === Blogs & personal stories (recovery, substance, alcohol) ===
  { id: "recovery-com", title: "Recovery.com – Stories & Resources", url: "https://recovery.com/" },
  { id: "eleanor-health-blog", title: "Eleanor Health – Recovery Blog", url: "https://www.eleanorhealth.com/blog" },
  { id: "positiverecovery-blog", title: "Positive Recovery – Blog", url: "https://positiverecovery.com/blog/" },
  { id: "hazelden-blog", title: "Hazelden Betty Ford – Articles", url: "https://www.hazeldenbettyford.org/articles" },
  { id: "shatterproof-blog", title: "Shatterproof – Stories & News", url: "https://www.shatterproof.org/blog" },
  { id: "tempest-blog", title: "The Tempest – Sobriety & Recovery", url: "https://www.jointempest.com/blog" },
  { id: "soberistas-blog", title: "Soberistas – Community & Stories", url: "https://soberistas.com/" },
  { id: "recovery-elevator-blog", title: "Recovery Elevator – Podcast & Blog", url: "https://recoveryelevator.com/blog/" },
  { id: "this-naked-mind", title: "This Naked Mind", url: "https://www.thisnakedmind.com/" },
  { id: "ann-dowsett-johnston", title: "Drink – Ann Dowsett Johnston", url: "https://anndowsettjohnston.com/" },
  { id: "sober-curious", title: "Sober Curious Movement", url: "https://www.rubywarrington.com/sober-curious" },
  { id: "alcohol-explained", title: "Alcohol Explained (William Porter)", url: "https://alcoholexplained.com/" },
  { id: "quit-like-woman", title: "Quit Like a Woman (Holly Whitaker)", url: "https://www.hollywhitaker.com/" },
  { id: "soberful", title: "Soberful – Recovery Support", url: "https://www.soberful.com/" },
  { id: "sober-recovery-forums", title: "Sober Recovery – Forums & Articles", url: "https://www.soberrecovery.com/" },
  { id: "addiction-center-blog", title: "American Addiction Centers – Blog", url: "https://americanaddictioncenters.org/blog" },
  { id: "rehabs-com", title: "Rehabs.com – Addiction Resources", url: "https://www.rehabs.com/" },
  { id: "drug-rehab-us", title: "DrugRehab.com – Alcohol & Addiction", url: "https://www.drugrehab.com/" },
  { id: "foundation-recovery", title: "Foundation for Recovery", url: "https://www.forrecovery.org/" },
  { id: "sober-nation", title: "Sober Nation – Resources", url: "https://sobernation.com/" },
  { id: "addiction-center-education", title: "Addiction Center – Education", url: "https://www.addictioncenter.com/" },
  { id: "verywell-mind-alcohol", title: "Verywell Mind – Alcohol", url: "https://www.verywellmind.com/alcohol-4014645" },
  { id: "medical-news-today-alcohol", title: "Medical News Today – Alcohol", url: "https://www.medicalnewstoday.com/categories/alcohol-addiction" },
  { id: "nih-medline-alcohol", title: "MedlinePlus – Alcohol", url: "https://medlineplus.gov/alcohol.html" },
  { id: "nimh-substance", title: "NIMH – Substance Use", url: "https://www.nimh.nih.gov/health/topics/substance-use-and-addiction-research" },
  { id: "cdc-excessive-drinking", title: "CDC – Excessive Drinking", url: "https://www.cdc.gov/alcohol/excessive-drinking/index.html" },
  { id: "cdc-factsheet-alcohol", title: "CDC – Alcohol Fact Sheet", url: "https://www.cdc.gov/alcohol/fact-sheets/alcohol-use.htm" },
  { id: "who-alcohol-factsheet", title: "WHO – Alcohol Fact Sheet", url: "https://www.who.int/news-room/fact-sheets/detail/alcohol" },
  { id: "apa-addiction", title: "APA – Addiction", url: "https://www.apa.org/topics/addiction" },
  { id: "nimh-co-occurring", title: "NIMH – Co-occurring Disorders", url: "https://www.nimh.nih.gov/health/topics/substance-use-and-mental-health" },
];

export function getResourceById(id: string): { id: string; title: string; url: string } | undefined {
  return RECOVERY_RESOURCES.find((r) => r.id === id);
}

export function getResourcesForPrompt(): string {
  return RECOVERY_RESOURCES.map((r) => `- ${r.id}: ${r.title} (${r.url})`).join("\n");
}
