import { useState, useEffect, useMemo } from 'react'
import './App.scss'
import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom'
import Home from "./pages/Home"
import Elections from "./pages/Elections"
import ElectionBoard from "./pages/Elections/ElectionBoard"
import ElectionResults from "./pages/Elections/ElectionResults"
import Layout from "./pages/Layout"
import Club from "./pages/Clubs/Club"
import TitleIX from './pages/Resources/TitleIX'
import FreshMenCorner from './pages/More/FreshmenCorner'
import Charter from './pages/About/Charter'
import ClubResources from './pages/Clubs/ClubResources'
import Wellness from './pages/Resources/Wellness'
import Resources from './pages/Resources/Resources'
import Clubs from './pages/Clubs/Clubs'
import AboutLSA from './pages/About/AboutLSA'
import Organization from './pages/Organizations/Organizations'
import ScrollToTop from "./components/ScrollToTop";
import SBC from './pages/About/SBC'
import DSA from './pages/About/DSA'
import Site from './pages/More/Site'
import Events from './pages/More/Events'
import Committees from './pages/About/Committees'
import SpiritCommittee from './pages/About/SpiritCommittee'
import LsaTeamPage from './pages/About/LsaTeamPage'
import LSAExplore from './pages/About/LSAExplore'
import Registry from './pages/Registry/Registry'
import NewClub from './pages/Clubs/club_resources/NewClub'
import EventPlanning from './pages/Clubs/club_resources/EventPlanning'
import Fundraising from './pages/Clubs/club_resources/Fundraising'
import MockTrial from './pages/Organizations/MockTrial'
import ShieldAndScroll from './pages/Organizations/ShieldAndScroll'
import Archives from './pages/More/Archives'
import More from './pages/More/More'
import Forensic from './pages/Organizations/Forensic'
import Cardinalympics from './pages/Cardinalympics'
import { site } from './config/site.config.js'
import {
  mergeElectionConfigWithSheet,
  isElectionCandidateSheetFormat,
} from './utils/electionCandidatesFromSheet.js'
import applicationsSheetConfig from './config/applications.config.js'
import ApplicationsOpen from './pages/ApplicationsOpen'
import Announcements from './pages/Announcements'
import NotFound from './pages/NotFound'

const SHEETS_COOKIE_TTL_DAYS = 1;
const SHEETS_CHECK_WINDOW_MS = 60 * 1000;
const SHEETS_LAST_CHECK_COOKIE = "lsa_sheets_last_check_ms_v1";
const SHEETS_RETRY_ATTEMPTS = 3;
const SHEETS_RETRY_DELAY_MS = 700;

function readCookie(name) {
  if (typeof document === "undefined") return null;
  const key = `${name}=`;
  const parts = document.cookie ? document.cookie.split("; ") : [];
  for (const part of parts) {
    if (part.startsWith(key)) {
      return part.slice(key.length);
    }
  }
  return null;
}

function readJsonCookie(name) {
  try {
    const raw = readCookie(name);
    if (!raw) return null;
    return JSON.parse(decodeURIComponent(raw));
  } catch {
    return null;
  }
}

function writeCookie(name, value, days = SHEETS_COOKIE_TTL_DAYS) {
  if (typeof document === "undefined") return;
  const next = encodeURIComponent(String(value));
  const current = readCookie(name);
  if (current === next) return;
  const maxAge = days * 24 * 60 * 60;
  document.cookie = `${name}=${next}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

function writeJsonCookie(name, value, days = SHEETS_COOKIE_TTL_DAYS) {
  if (typeof document === "undefined") return;
  const next = encodeURIComponent(JSON.stringify(value));
  const current = readCookie(name);
  if (current === next) return; // avoid rewriting the same value every visit
  const maxAge = days * 24 * 60 * 60;
  document.cookie = `${name}=${next}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

function reserveSheetsRefreshWindow() {
  const now = Date.now();
  const lastRaw = readCookie(SHEETS_LAST_CHECK_COOKIE);
  const last = lastRaw ? parseInt(decodeURIComponent(lastRaw), 10) : 0;
  if (!Number.isNaN(last) && now - last < SHEETS_CHECK_WINDOW_MS) {
    return false;
  }
  writeCookie(SHEETS_LAST_CHECK_COOKIE, now);
  return true;
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchSheetValuesWithRetry(url, options = {}) {
  const attempts = options.attempts ?? SHEETS_RETRY_ATTEMPTS;
  const delayMs = options.delayMs ?? SHEETS_RETRY_DELAY_MS;
  let lastError = null;

  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url, options.fetchOptions);
      const json = await res.json();
      if (json?.error) {
        lastError = json.error.message || "Unknown API error";
      } else if (Array.isArray(json?.values) && json.values.length > 0) {
        return { values: json.values, error: null };
      } else {
        lastError = "No data returned";
      }
    } catch (error) {
      lastError = error?.message || "Network error";
    }

    if (i < attempts - 1) {
      await delay(delayMs);
    }
  }

  return { values: null, error: lastError || "Failed to fetch sheet data" };
}

function App() {
    // main site data from Google Sheets (yes the key is here, we're not doing auth for a read-only sheet)
    const KEY = "AIzaSyAgshc5Aqd8B149h5RpsenMh_SQAeb4AXc";
    const SPREADSHEET_ID = "1Kk7Bs58DAWZ9pHvqD-RFvoV1ePeThQ1Yr9c5RsDeAq4";
    const SHEET_NAME = "Website Info"
    const SHEET_NAME2 = "Officers"
    const [clubData, setClubData] = useState([]);
    const [officerData, setOfficerData] = useState([]);

    // Cardinalympics points and scoreboard
    const SPREADSHEET_ID2 = "1YoyeAEx3rFD2ctbrz3R0a0todgsNes76r_JH6MkYUO4";
    const SHEET_NAME3 = "Sp, 25";
    const [cardinalympicsData, setCardinalympicsData] = useState([0, 0, 0, 0]);
    const [scoreboardRows, setScoreboardRows] = useState([]);

    const SHEET_NAME4 = "Elections";
    const [electionSheetValues, setElectionSheetValues] = useState(null);

    // which clubs/orgs have applications open right now
    const [applicationsData, setApplicationsData] = useState([]);
    const [applicationsLoading, setApplicationsLoading] = useState(true);
    const [applicationsError, setApplicationsError] = useState(null);
    const shouldCheckSheetsNow = useMemo(() => reserveSheetsRefreshWindow(), []);

    // okay so we have like 4 useEffects for 4 sheets - not pretty but it works
    useEffect(() => {
      async function fetchData() {
        const clubCookieKey = "lsa_sheet_website_info_v1";
        const officerCookieKey = "lsa_sheet_officers_v1";
        const cachedClubValues = readJsonCookie(clubCookieKey);
        const cachedOfficerValues = readJsonCookie(officerCookieKey);

        if (cachedClubValues?.length) {
          setClubData(processSheetData(cachedClubValues));
        }
        if (cachedOfficerValues?.length) {
          setOfficerData(processSheetData(cachedOfficerValues));
        }
        const hasCachedCoreData = Boolean(cachedClubValues?.length) && Boolean(cachedOfficerValues?.length);
        if (!shouldCheckSheetsNow && hasCachedCoreData) return;

        try {
          // clubs + officers (first two sheets)
          const url1 = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(SHEET_NAME)}?key=${KEY}`;
          const clubFetch = await fetchSheetValuesWithRetry(url1);
          if (clubFetch.values?.length) {
            setClubData(processSheetData(clubFetch.values));
            writeJsonCookie(clubCookieKey, clubFetch.values);
          } else {
            console.warn("Website Info sheet:", clubFetch.error);
          }

          const url2 = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(SHEET_NAME2)}?key=${KEY}`;
          const officerFetch = await fetchSheetValuesWithRetry(url2);
          if (officerFetch.values?.length) {
            setOfficerData(processSheetData(officerFetch.values));
            writeJsonCookie(officerCookieKey, officerFetch.values);
          } else {
            console.warn("Officers sheet:", officerFetch.error);
          }
        } catch (error) {
          console.log(error);
        }
      }
      fetchData();
    }, [shouldCheckSheetsNow]);

    useEffect(() => {
      async function fetchElectionData() {
        const electionCookieKey = "lsa_sheet_elections_v1";
        const cachedElectionValues = readJsonCookie(electionCookieKey);
        if (cachedElectionValues?.length) {
          setElectionSheetValues(cachedElectionValues);
        }
        if (!shouldCheckSheetsNow && cachedElectionValues?.length) return;
        try {
          const range = encodeURIComponent(SHEET_NAME4);
          const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${range}?key=${KEY}`;
          const electionFetch = await fetchSheetValuesWithRetry(url);
          if (electionFetch.values?.length) {
            setElectionSheetValues(electionFetch.values);
            writeJsonCookie(electionCookieKey, electionFetch.values);
          } else {
            console.warn("Elections sheet:", electionFetch.error);
          }
        } catch (error) {
          console.log(error);
        }
      }
      fetchElectionData();
    }, [shouldCheckSheetsNow]);

    const electionData = useMemo(() => {
      if (!electionSheetValues?.length) return [];
      if (isElectionCandidateSheetFormat(electionSheetValues)) return [];
      return processSheetData(electionSheetValues);
    }, [electionSheetValues]);

    const electionsConfigResolved = useMemo(
      () => mergeElectionConfigWithSheet(site.elections, electionSheetValues),
      [electionSheetValues]
    );


    const CARDINALYMPICS_POLL_MS = 30_000;

    useEffect(() => {
      // Refreshes class totals (home + Cardinalympics & detailed scoreboard)
      function applyCardinalympicsValues(values) {
        if (!Array.isArray(values) || values.length === 0) return;
        const totals = arrayCleanUp(values[0]);
        const classTotals = totals.length >= 5 ? totals.slice(-4) : totals.slice(0, 4);
        setCardinalympicsData(classTotals);
        // Clone rows so React always sees a new reference when the sheet updates.
        setScoreboardRows(values.map((row) => (Array.isArray(row) ? [...row] : row)));
      }

      async function fetchCardinalympicsData() {
        const cardinalympicsCookieKey = "lsa_sheet_cardinalympics_v1";
        const cachedValues = readJsonCookie(cardinalympicsCookieKey);
        if (cachedValues?.length) {
          applyCardinalympicsValues(cachedValues);
        }
        if (!reserveSheetsRefreshWindow() && cachedValues?.length) {
          return;
        }
        try {
          const range = encodeURIComponent(SHEET_NAME3);
          const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID2}/values/${range}?key=${KEY}`;
          const cardinalympicsFetch = await fetchSheetValuesWithRetry(url, {
            fetchOptions: { cache: "no-store" },
          });
          if (cardinalympicsFetch.values?.length) {
            applyCardinalympicsValues(cardinalympicsFetch.values);
            writeJsonCookie(cardinalympicsCookieKey, cardinalympicsFetch.values);
          } else {
            console.warn("Cardinalympics sheet:", cardinalympicsFetch.error);
          }
        } catch (error) {
          console.log(error);
        }
      }

      const hasCachedCardinalympics = Boolean(readJsonCookie("lsa_sheet_cardinalympics_v1")?.length);
      if (shouldCheckSheetsNow || !hasCachedCardinalympics) {
        fetchCardinalympicsData();
      } else {
        const cachedValues = readJsonCookie("lsa_sheet_cardinalympics_v1");
        if (cachedValues?.length) applyCardinalympicsValues(cachedValues);
      }
      const pollId = setInterval(fetchCardinalympicsData, CARDINALYMPICS_POLL_MS);
      return () => clearInterval(pollId);
    }, [shouldCheckSheetsNow]);

    useEffect(() => {
      async function fetchApplicationsData() {
        setApplicationsError(null);
        setApplicationsLoading(true);
        const appsCookieKey = "lsa_sheet_applications_v1";
        const cachedApplicationsValues = readJsonCookie(appsCookieKey);
        if (cachedApplicationsValues?.length) {
          setApplicationsData(processApplicationsSheetData(cachedApplicationsValues));
        }
        if (!shouldCheckSheetsNow && cachedApplicationsValues?.length) {
          setApplicationsLoading(false);
          return;
        }

        try {
          const { spreadsheetId, sheetName, sheetNames } = applicationsSheetConfig;
          const names = sheetNames?.length
            ? sheetNames
            : [sheetName].filter(Boolean);

          let lastError = null;
          for (const name of names) {
            const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(name)}?key=${KEY}`;
            const fetchResult = await fetchSheetValuesWithRetry(url);
            if (!fetchResult.values?.length) {
              lastError = fetchResult.error || "Unknown API error";
              console.warn("Applications sheet fetch:", name, lastError);
              continue;
            }
            setApplicationsData(processApplicationsSheetData(fetchResult.values));
            writeJsonCookie(appsCookieKey, fetchResult.values);
            return;
          }
          if (cachedApplicationsValues?.length) {
            setApplicationsError(
              `Live applications data unavailable (${lastError || "Could not load applications tab"}). Showing last saved data.`
            );
          } else {
            setApplicationsData([]);
            setApplicationsError(
              lastError || "Could not load the applications spreadsheet tab."
            );
          }
        } catch (error) {
          console.warn(error);
          if (cachedApplicationsValues?.length) {
            setApplicationsError(
              `Network error loading applications (${error?.message || "Unknown error"}). Showing last saved data.`
            );
          } else {
            setApplicationsData([]);
            setApplicationsError(error?.message || "Network error loading applications.");
          }
        } finally {
          setApplicationsLoading(false);
        }
      }
      fetchApplicationsData();
    }, [shouldCheckSheetsNow]);


    function arrayCleanUp(array) {
      const cleanedArray = [];
      for (let i = 0; i < array.length; i++) {
        if (array[i] !== "" && !isNaN(parseInt(array[i]))) {
          cleanedArray.push(parseInt(array[i]));
        }
      }
      return cleanedArray;
    }

    function processSheetData(data) {
        if (!data || data.length === 0) return [];
    
        const headers = data[0]; 
        const rows = data.slice(1);
    
        return rows.map(row => {
            const obj = {};
            headers.forEach((header, index) => {
                obj[header] = row[index] || "";
            });
            return obj;
        });
    }

    // applications sheet 
    function processApplicationsSheetData(data) {
        if (!data || data.length === 0) return [];
        let headerRowIndex = 0;
        for (let i = 0; i < Math.min(data.length, 5); i++) {
            const row = data[i];
            if (Array.isArray(row) && row.some(cell => {
                const s = String(cell || "").trim();
                return s === "Status" || s === "Name of Org/Club";
            })) {
                headerRowIndex = i;
                break;
            }
        }
        const headers = data[headerRowIndex];
        const rows = data.slice(headerRowIndex + 1);
        return rows.map(row => {
            const obj = {};
            headers.forEach((header, index) => {
                const key = String(header ?? "").trim() || `Column${index}`;
                obj[key] = row[index] != null ? String(row[index]) : "";
            });
            return obj;
        });
    }

  return (
    <>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route element={<Layout clubData={clubData} electionsEnabled={site.electionsEnabled} electionsConfig={electionsConfigResolved} />}>
            <Route path="/" element={<Home cardinalympicsData={cardinalympicsData} clubData={clubData} applicationsData={applicationsData} />} />
            <Route path="Elections" element={<Outlet />}>
              <Route index element={<Elections electionData={electionData} electionsEnabled={site.electionsEnabled} electionsConfig={electionsConfigResolved} />} />
              <Route path=":boardSlug" element={<ElectionBoard electionsConfig={electionsConfigResolved} />} />
              <Route path="Results" element={<ElectionResults electionData={electionData} electionsEnabled={site.electionsEnabled} electionsConfig={electionsConfigResolved} />} />
            </Route>
            
            <Route path="LSA" element={<Outlet />}>
              <Route index element={<AboutLSA/>} />
              <Route path="SBC" element={<SBC officerData={officerData}/>} />
              <Route path="DSA" element={<DSA />} />
              <Route path="Charter" element={<Charter />}/>
              <Route path="Commitees" element={<Committees />} />
              <Route path="Spirit Committee" element={<SpiritCommittee />} />
              <Route path=":BoardName" element={<LsaTeamPage officerData={officerData} />} />
              
            </Route>

            <Route path="Organizations" element = {<Outlet />}>
              <Route index element={<Organization />} />
              <Route path="MockTrial" element={<MockTrial />} />
              <Route path="ShieldAndScroll" element={<ShieldAndScroll />} />
              <Route path="Forensic" element={<Forensic />} />
            </Route>

            <Route path="Clubs" element={<Outlet />}>
              <Route index element={<Clubs clubData={clubData}/>} />
              <Route path="ClubResources" element={<ClubResources />} />
              <Route path=":ClubName" element={<Club clubData={clubData}/>}/>
              <Route path="NewClub" element={<NewClub />} />
              <Route path="EventPlanning" element={<EventPlanning />} />
              <Route path="Fundraising" element={<Fundraising />} />
            </Route>

            <Route
              path="ApplicationsOpen"
              element={
                <ApplicationsOpen
                  applicationsData={applicationsData}
                  applicationsLoading={applicationsLoading}
                  applicationsError={applicationsError}
                />
              }
            />
            <Route path="Announcements" element={<Announcements />} />
            <Route path="Resources" element={<Outlet />}>
              <Route index element={<Resources />} />
              <Route
                path="ApplicationsOpen"
                element={<Navigate to="/ApplicationsOpen" replace />}
              />
              <Route path="Wellness" element={<Wellness />} />
              <Route path="TitleIX" element={<TitleIX />} />
            </Route>
            <Route path="LSA-EXPLORE" element={<LSAExplore />} />
            <Route path="Wellness" element={<Navigate to="/Resources/Wellness" replace />} />
            <Route path="TitleIX" element={<Navigate to="/Resources/TitleIX" replace />} />
            
            <Route path="FreshmenCorner" element= {<FreshMenCorner />} />
            <Route path="Registry" element={<Registry />} />
            <Route path="Events" element={<Events />} />
            <Route path="AboutSite" element={<Site />} />
            <Route path="Archives" element={<Archives />} />
            <Route path="Cardinalympics" element={<Cardinalympics cardinalympicsData={cardinalympicsData} scoreboardRows={scoreboardRows} />} />  
            <Route path="More" element={<More />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App