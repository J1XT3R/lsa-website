/**
 * Elections configuration.
 * Set enabled in site.config.js. Here you control state and copy.
 *
 * State: "off" | "contesting" | "polling" | "result"
 * - off: not used when elections are disabled (site.config)
 * - contesting: only contenders are shown (campaign period)
 * - polling: voting open; show "Vote now" + optional live results bar
 * - result: show final results
 *
 * Each candidate: { name, description, pfp, video }
 * - pfp: profile photo URL
 * - video: URL to play on hover over pfp (mp4 recommended)
 */

const PLACEHOLDER_VIDEO = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4";

function avatar(id) {
  return `https://i.pravatar.cc/400?u=${encodeURIComponent(id)}`;
}

// Long paragraph-style descriptions (like candidate bios)
const LONG_DESC = {
  electionsCommissioner: "Hey everyone! I'm very excited to serve as your SBC Elections Commissioner this year!! I will be running the Freshmen Elections in the fall and General Elections in the spring!! My biggest goal this year is making sure both elections run as smoothly as possible, as well as boosting Freshmen class spirit prior to Freshmen Elections. Outside of SBC, you might find me re-binging TV shows, hanging out with friends or preparing for my next dance showcase/competition. I'll always appreciate a good show recommendation. I'm looking forward to another successful school year with you all. Feel free to reach out through email for any questions or suggestions!!",
  president: "Hey everyone! I'm running to be your SBC President and I couldn't be more excited. My main goals are strengthening student voice, improving transparency between the administration and students, and making sure every student feels represented. I have experience in student government and event planning, and I'm committed to listening to your ideas and turning them into action. Outside of school I love spending time with friends, exploring the city, and staying active. I'd be honored to serve you—reach out anytime with questions or suggestions!!",
  vicePresident: "Hi everyone! I'm running for Vice President because I care deeply about spirit, community, and making LSA events inclusive and fun for everyone. I want to support the President and the rest of the board in bringing your ideas to life and making sure our events and initiatives reflect what students actually want. I'm organized, approachable, and ready to put in the work. When I'm not in meetings you can find me at school events or studying with friends. Let's make this year one to remember—feel free to reach out!!",
  secretary: "Hey! I'm running for Secretary because I believe clear, organized records and communication are the backbone of an effective board. I'm detail-oriented and committed to keeping minutes accurate and accessible so that everyone stays on the same page. I also want to make sure students can easily find information about what SBC is doing. Outside of SBC I enjoy reading, writing, and coffee runs with friends. I'm excited to contribute to the team and would love to hear from you—email me anytime!!",
  treasurer: "Hi everyone! I'm running for Treasurer because I care about responsible, transparent budgeting. I have experience with finance and numbers, and my goal is to make sure every dollar supports student initiatives and events in a way that's clear and accountable. I want to work with the board to fund what matters to you. When I'm not crunching numbers I like hiking, gaming, and hanging out with friends. Questions about budgets or ideas? Reach out—I'm here for it!!",
  pr: "Hey! I'm running for Public Relations because I love storytelling, design, and making sure everyone knows what's going on. I want to boost our social media presence, improve outreach, and make LSA events and news impossible to miss. I'm creative, responsive, and ready to work with the rest of the board to get the word out. Outside of that I'm into photography, music, and exploring new spots with friends. Hit me up with ideas or feedback anytime!!",
  clubCoordinator: "Hi everyone! I'm running for Club Coordinator because I want to help every club thrive. I'm focused on connecting clubs with resources, streamlining processes, and fostering collaboration between different groups. Whether you're in an existing club or thinking of starting one, I want to be a go-to resource. I'm organized and love building community. When I'm not in the club room I'm usually at practice or hanging with friends. Reach out for anything club-related!!",
  eventsCoordinator: "Hey! I'm running for Events Coordinator because I love bringing people together. I want to plan memorable spirit and community events that actually reflect what students want—and run them smoothly from start to finish. I have experience with logistics and creativity, and I'm ready to work with the board and hear your ideas. Outside of planning I enjoy concerts, food, and time with friends. Let's make this year's events the best yet—feel free to reach out!!",
  danceCoordinator: "Hi everyone! I'm running for Dance Coordinator because I want our dances to be safe, fun, and inclusive for every student. I care about themes, venues, and making sure everyone has a great time while keeping everything organized and within budget. I've been involved in dance and events before and I'm ready to bring that experience to the board. When I'm not planning you might find me at the gym or with friends. Questions or ideas? I'd love to hear from you!!",
  communityLiaison: "Hey! I'm running for Community Liaison because I believe strong connections between LSA and the wider community make us all stronger. I want to build partnerships, support outreach, and make sure our school is a positive force in the community. I'm communicative and dedicated to bridging different groups. Outside of that I enjoy volunteering, reading, and spending time with family and friends. Reach out with any questions or suggestions!!",
  classPresident: "Hey everyone! I'm running to represent our class and amplify your voice. I want to make sure we're united, heard, and that our events and initiatives reflect what we care about. I'm committed to transparency, collaboration, and making this year one we'll remember. When I'm not in meetings I love hanging with friends and staying involved in school life. Feel free to reach out anytime—I'm here for you!!",
  classRole: "Hi! I'm running for this position because I want to contribute to our class and support the board. I'm organized, dedicated, and ready to listen to your ideas and turn them into action. I believe in teamwork and making sure every student feels included. Outside of school I enjoy spending time with friends and staying active. Reach out if you have questions or suggestions—I'd love to hear from you!!",
};

export default {
  /** "contesting" | "polling" | "result" (only used when elections are enabled) */
  state: "contesting",

  /** Shown when state is "contesting" or "polling" (election in progress) */
  banner: {
    enabled: true,
    title: "Elections in progress",
    message: "Make your voice heard — vote in LSA elections.",
    ctaText: "Vote now",
    ctaPath: "/Elections",
  },

  /** Shown in Layout when state is "polling" (e.g. "Polling for results") */
  pollingBar: {
    enabled: true,
    message: "Polls are open. Results will be posted after voting ends.",
    resultsLabel: "Results",
    resultsPath: "/Elections",
  },

  /** Shown on Elections page when state is "off" (elections disabled globally) */
  notHappeningMessage: "Elections are not currently happening. Check back later for updates.",

  /** Shown on Elections page when state is "contesting" (before voting) */
  contestingTitle: "Meet the candidates",
  contestingSubtitle: "Voting will open soon. Get to know the contenders.",

  /** Shown when state is "polling" */
  pollingTitle: "Elections — vote now",
  pollingSubtitle: "Polls are open. Cast your vote below.",

  /**
   * Contenders for state "contesting". Each board has slug for URL (e.g. /Elections/SBC).
   * Candidates have: name, description, pfp, video.
   */
  contenders: [
    {
      slug: "SBC",
      board: "SBC Elections",
      color: "#9c1919",
      roles: [
        {
          role: "President",
          candidates: [
            { name: "Jordan Kim", description: LONG_DESC.president, pfp: avatar("sbc-jordan"), video: PLACEHOLDER_VIDEO },
            { name: "Sam Rivera", description: LONG_DESC.president, pfp: avatar("sbc-sam"), video: PLACEHOLDER_VIDEO },
          ],
        },
        {
          role: "Vice President",
          candidates: [
            { name: "Alex Chen", description: LONG_DESC.vicePresident, pfp: avatar("sbc-alex"), video: PLACEHOLDER_VIDEO },
            { name: "Morgan Lee", description: LONG_DESC.vicePresident, pfp: avatar("sbc-morgan"), video: PLACEHOLDER_VIDEO },
          ],
        },
        {
          role: "Elections Commissioner",
          candidates: [
            { name: "Taylor Nguyen", description: LONG_DESC.electionsCommissioner, pfp: avatar("sbc-taylor"), video: PLACEHOLDER_VIDEO },
            { name: "Riley Park", description: LONG_DESC.electionsCommissioner, pfp: avatar("sbc-riley"), video: PLACEHOLDER_VIDEO },
          ],
        },
        {
          role: "Secretary",
          candidates: [
            { name: "Casey Wong", description: LONG_DESC.secretary, pfp: avatar("sbc-casey"), video: PLACEHOLDER_VIDEO },
            { name: "Jamie Foster", description: LONG_DESC.secretary, pfp: avatar("sbc-jamie"), video: PLACEHOLDER_VIDEO },
          ],
        },
        {
          role: "Treasurer",
          candidates: [
            { name: "Drew Martinez", description: LONG_DESC.treasurer, pfp: avatar("sbc-drew"), video: PLACEHOLDER_VIDEO },
            { name: "Quinn Adams", description: LONG_DESC.treasurer, pfp: avatar("sbc-quinn"), video: PLACEHOLDER_VIDEO },
          ],
        },
        {
          role: "Public Relations",
          candidates: [
            { name: "Jordan Kim", description: LONG_DESC.pr, pfp: avatar("sbc-jordan2"), video: PLACEHOLDER_VIDEO },
            { name: "Sam Rivera", description: LONG_DESC.pr, pfp: avatar("sbc-sam2"), video: PLACEHOLDER_VIDEO },
          ],
        },
        {
          role: "Co-Public Relations",
          candidates: [
            { name: "Alex Chen", description: LONG_DESC.pr, pfp: avatar("sbc-alex2"), video: PLACEHOLDER_VIDEO },
          ],
        },
        {
          role: "Club Coordinator",
          candidates: [
            { name: "Morgan Lee", description: LONG_DESC.clubCoordinator, pfp: avatar("sbc-morgan2"), video: PLACEHOLDER_VIDEO },
            { name: "Taylor Nguyen", description: LONG_DESC.clubCoordinator, pfp: avatar("sbc-taylor2"), video: PLACEHOLDER_VIDEO },
          ],
        },
        {
          role: "Events Coordinator",
          candidates: [
            { name: "Riley Park", description: LONG_DESC.eventsCoordinator, pfp: avatar("sbc-riley2"), video: PLACEHOLDER_VIDEO },
            { name: "Casey Wong", description: LONG_DESC.eventsCoordinator, pfp: avatar("sbc-casey2"), video: PLACEHOLDER_VIDEO },
          ],
        },
        {
          role: "Dance Coordinator",
          candidates: [
            { name: "Jamie Foster", description: LONG_DESC.danceCoordinator, pfp: avatar("sbc-jamie2"), video: PLACEHOLDER_VIDEO },
            { name: "Drew Martinez", description: LONG_DESC.danceCoordinator, pfp: avatar("sbc-drew2"), video: PLACEHOLDER_VIDEO },
          ],
        },
        {
          role: "Community Liaison",
          candidates: [
            { name: "Quinn Adams", description: LONG_DESC.communityLiaison, pfp: avatar("sbc-quinn2"), video: PLACEHOLDER_VIDEO },
          ],
        },
      ],
    },
    {
      slug: "LSA-2027",
      board: "LSA 2027 Elections",
      color: "#9c1919",
      roles: [
        { role: "President", candidates: [{ name: "Blake Sullivan", description: LONG_DESC.classPresident, pfp: avatar("2027-blake"), video: PLACEHOLDER_VIDEO }, { name: "Hayden Cruz", description: LONG_DESC.classPresident, pfp: avatar("2027-hayden"), video: PLACEHOLDER_VIDEO }] },
        { role: "Vice President", candidates: [{ name: "Skyler Reed", description: LONG_DESC.classRole, pfp: avatar("2027-skyler"), video: PLACEHOLDER_VIDEO }, { name: "Parker Dunn", description: LONG_DESC.classRole, pfp: avatar("2027-parker"), video: PLACEHOLDER_VIDEO }] },
        { role: "Secretary", candidates: [{ name: "Avery Cole", description: LONG_DESC.classRole, pfp: avatar("2027-avery"), video: PLACEHOLDER_VIDEO }, { name: "Finley Shaw", description: LONG_DESC.classRole, pfp: avatar("2027-finley"), video: PLACEHOLDER_VIDEO }] },
        { role: "Treasurer", candidates: [{ name: "Emery Brooks", description: LONG_DESC.classRole, pfp: avatar("2027-emery"), video: PLACEHOLDER_VIDEO }, { name: "Reese Walsh", description: LONG_DESC.classRole, pfp: avatar("2027-reese"), video: PLACEHOLDER_VIDEO }] },
        { role: "Public Relations", candidates: [{ name: "Cameron Fox", description: LONG_DESC.classRole, pfp: avatar("2027-cameron"), video: PLACEHOLDER_VIDEO }] },
        { role: "Historian", candidates: [{ name: "Dakota Hayes", description: LONG_DESC.classRole, pfp: avatar("2027-dakota"), video: PLACEHOLDER_VIDEO }, { name: "Sage Morgan", description: LONG_DESC.classRole, pfp: avatar("2027-sage"), video: PLACEHOLDER_VIDEO }] },
        { role: "Club Coordinator", candidates: [{ name: "Rowan Blake", description: LONG_DESC.classRole, pfp: avatar("2027-rowan"), video: PLACEHOLDER_VIDEO }] },
        { role: "Dance Coordinator", candidates: [{ name: "Peyton Lane", description: LONG_DESC.classRole, pfp: avatar("2027-peyton"), video: PLACEHOLDER_VIDEO }, { name: "Quinn Hart", description: LONG_DESC.classRole, pfp: avatar("2027-quinn"), video: PLACEHOLDER_VIDEO }] },
        { role: "Community Liaison", candidates: [{ name: "Jordan Tate", description: LONG_DESC.classRole, pfp: avatar("2027-jordan"), video: PLACEHOLDER_VIDEO }] },
      ],
    },
    {
      slug: "LSA-2028",
      board: "LSA 2028 Elections",
      color: "#2d5a87",
      roles: [
        { role: "President", candidates: [{ name: "Riley Chen", description: LONG_DESC.classPresident, pfp: avatar("2028-riley"), video: PLACEHOLDER_VIDEO }, { name: "Avery Liu", description: LONG_DESC.classPresident, pfp: avatar("2028-avery"), video: PLACEHOLDER_VIDEO }] },
        { role: "Vice President", candidates: [{ name: "Jordan Park", description: LONG_DESC.classRole, pfp: avatar("2028-jordan"), video: PLACEHOLDER_VIDEO }, { name: "Casey Yoon", description: LONG_DESC.classRole, pfp: avatar("2028-casey"), video: PLACEHOLDER_VIDEO }] },
        { role: "Secretary", candidates: [{ name: "Morgan Kim", description: LONG_DESC.classRole, pfp: avatar("2028-morgan"), video: PLACEHOLDER_VIDEO }, { name: "Taylor Zhang", description: LONG_DESC.classRole, pfp: avatar("2028-taylor"), video: PLACEHOLDER_VIDEO }] },
        { role: "Treasurer", candidates: [{ name: "Quinn Wang", description: LONG_DESC.classRole, pfp: avatar("2028-quinn"), video: PLACEHOLDER_VIDEO }, { name: "Alex Tran", description: LONG_DESC.classRole, pfp: avatar("2028-alex"), video: PLACEHOLDER_VIDEO }] },
        { role: "Public Relations", candidates: [{ name: "Sam Lee", description: LONG_DESC.classRole, pfp: avatar("2028-sam"), video: PLACEHOLDER_VIDEO }, { name: "Drew Nguyen", description: LONG_DESC.classRole, pfp: avatar("2028-drew"), video: PLACEHOLDER_VIDEO }] },
        { role: "Historian", candidates: [{ name: "Jamie Wu", description: LONG_DESC.classRole, pfp: avatar("2028-jamie"), video: PLACEHOLDER_VIDEO }, { name: "Skyler Huang", description: LONG_DESC.classRole, pfp: avatar("2028-skyler"), video: PLACEHOLDER_VIDEO }] },
        { role: "Club Coordinator", candidates: [{ name: "Parker Lin", description: LONG_DESC.classRole, pfp: avatar("2028-parker"), video: PLACEHOLDER_VIDEO }] },
        { role: "Dance Coordinator", candidates: [{ name: "Blake Zhao", description: LONG_DESC.classRole, pfp: avatar("2028-blake"), video: PLACEHOLDER_VIDEO }, { name: "Hayden Xu", description: LONG_DESC.classRole, pfp: avatar("2028-hayden"), video: PLACEHOLDER_VIDEO }] },
        { role: "Community Liaison", candidates: [{ name: "Finley Ma", description: LONG_DESC.classRole, pfp: avatar("2028-finley"), video: PLACEHOLDER_VIDEO }] },
      ],
    },
    {
      slug: "LSA-2029",
      board: "LSA 2029 Elections",
      color: "#6b2d5c",
      roles: [
        { role: "President", candidates: [{ name: "Taran Yang", description: LONG_DESC.classPresident, pfp: avatar("2029-taran"), video: PLACEHOLDER_VIDEO }, { name: "Jordan Mitchell", description: LONG_DESC.classPresident, pfp: avatar("2029-jordan"), video: PLACEHOLDER_VIDEO }] },
        { role: "Vice President", candidates: [{ name: "Preston Wang", description: LONG_DESC.classRole, pfp: avatar("2029-preston"), video: PLACEHOLDER_VIDEO }, { name: "Alex Thompson", description: LONG_DESC.classRole, pfp: avatar("2029-alex"), video: PLACEHOLDER_VIDEO }] },
        { role: "Secretary", candidates: [{ name: "Violette Trinh-Hsu", description: LONG_DESC.classRole, pfp: avatar("2029-violette"), video: PLACEHOLDER_VIDEO }, { name: "Morgan Davis", description: LONG_DESC.classRole, pfp: avatar("2029-morgan"), video: PLACEHOLDER_VIDEO }] },
        { role: "Treasurer", candidates: [{ name: "Shirley Guan", description: LONG_DESC.classRole, pfp: avatar("2029-shirley"), video: PLACEHOLDER_VIDEO }, { name: "Casey Johnson", description: LONG_DESC.classRole, pfp: avatar("2029-casey"), video: PLACEHOLDER_VIDEO }] },
        { role: "Public Relations", candidates: [{ name: "Zarina Gorji", description: LONG_DESC.classRole, pfp: avatar("2029-zarina"), video: PLACEHOLDER_VIDEO }, { name: "Taylor Brown", description: LONG_DESC.classRole, pfp: avatar("2029-taylor"), video: PLACEHOLDER_VIDEO }] },
        { role: "Historian", candidates: [{ name: "Ashley Zhao", description: LONG_DESC.classRole, pfp: avatar("2029-ashley"), video: PLACEHOLDER_VIDEO }, { name: "Quinn Williams", description: LONG_DESC.classRole, pfp: avatar("2029-quinn"), video: PLACEHOLDER_VIDEO }] },
        { role: "Club Coordinator", candidates: [{ name: "Riley Martinez", description: LONG_DESC.classRole, pfp: avatar("2029-riley"), video: PLACEHOLDER_VIDEO }, { name: "Sam Garcia", description: LONG_DESC.classRole, pfp: avatar("2029-sam"), video: PLACEHOLDER_VIDEO }] },
        { role: "Dance Coordinator", candidates: [{ name: "Drew Anderson", description: LONG_DESC.classRole, pfp: avatar("2029-drew"), video: PLACEHOLDER_VIDEO }, { name: "Jamie Clark", description: LONG_DESC.classRole, pfp: avatar("2029-jamie"), video: PLACEHOLDER_VIDEO }] },
        { role: "Community Liaison", candidates: [{ name: "Parker Lewis", description: LONG_DESC.classRole, pfp: avatar("2029-parker"), video: PLACEHOLDER_VIDEO }] },
      ],
    },
    {
      slug: "LSA-2030",
      board: "LSA 2030 Elections",
      color: "#1a5f4a",
      roles: [
        { role: "President", candidates: [{ name: "Jordan Lee", description: LONG_DESC.classPresident, pfp: avatar("2030-jordan"), video: PLACEHOLDER_VIDEO }, { name: "Alex Kim", description: LONG_DESC.classPresident, pfp: avatar("2030-alex"), video: PLACEHOLDER_VIDEO }, { name: "Casey Park", description: LONG_DESC.classPresident, pfp: avatar("2030-casey"), video: PLACEHOLDER_VIDEO }] },
        { role: "Vice President", candidates: [{ name: "Morgan Chen", description: LONG_DESC.classRole, pfp: avatar("2030-morgan"), video: PLACEHOLDER_VIDEO }, { name: "Taylor Nguyen", description: LONG_DESC.classRole, pfp: avatar("2030-taylor"), video: PLACEHOLDER_VIDEO }, { name: "Quinn Tran", description: LONG_DESC.classRole, pfp: avatar("2030-quinn"), video: PLACEHOLDER_VIDEO }] },
        { role: "Secretary", candidates: [{ name: "Riley Wong", description: LONG_DESC.classRole, pfp: avatar("2030-riley"), video: PLACEHOLDER_VIDEO }, { name: "Sam Zhang", description: LONG_DESC.classRole, pfp: avatar("2030-sam"), video: PLACEHOLDER_VIDEO }] },
        { role: "Treasurer", candidates: [{ name: "Drew Liu", description: LONG_DESC.classRole, pfp: avatar("2030-drew"), video: PLACEHOLDER_VIDEO }, { name: "Jamie Huang", description: LONG_DESC.classRole, pfp: avatar("2030-jamie"), video: PLACEHOLDER_VIDEO }] },
        { role: "Public Relations", candidates: [{ name: "Parker Zhao", description: LONG_DESC.classRole, pfp: avatar("2030-parker"), video: PLACEHOLDER_VIDEO }, { name: "Blake Xu", description: LONG_DESC.classRole, pfp: avatar("2030-blake"), video: PLACEHOLDER_VIDEO }, { name: "Hayden Ma", description: LONG_DESC.classRole, pfp: avatar("2030-hayden"), video: PLACEHOLDER_VIDEO }] },
        { role: "Historian", candidates: [{ name: "Skyler Wu", description: LONG_DESC.classRole, pfp: avatar("2030-skyler"), video: PLACEHOLDER_VIDEO }, { name: "Finley Lin", description: LONG_DESC.classRole, pfp: avatar("2030-finley"), video: PLACEHOLDER_VIDEO }] },
        { role: "Club Coordinator", candidates: [{ name: "Avery Martinez", description: LONG_DESC.classRole, pfp: avatar("2030-avery"), video: PLACEHOLDER_VIDEO }, { name: "Peyton Garcia", description: LONG_DESC.classRole, pfp: avatar("2030-peyton"), video: PLACEHOLDER_VIDEO }] },
        { role: "Dance Coordinator", candidates: [{ name: "Dakota Anderson", description: LONG_DESC.classRole, pfp: avatar("2030-dakota"), video: PLACEHOLDER_VIDEO }, { name: "Rowan Clark", description: LONG_DESC.classRole, pfp: avatar("2030-rowan"), video: PLACEHOLDER_VIDEO }] },
        { role: "Community Liaison", candidates: [{ name: "Reese Lewis", description: LONG_DESC.classRole, pfp: avatar("2030-reese"), video: PLACEHOLDER_VIDEO }, { name: "Sage Adams", description: LONG_DESC.classRole, pfp: avatar("2030-sage"), video: PLACEHOLDER_VIDEO }] },
      ],
    },
  ],
};
