# Site configuration

Edit these files to change site data without touching component code.

## `site.config.js`
- **electionsEnabled**: Set to `false` to hide the Elections nav link and show "No elections at this time" on `/Elections`.
- **elections**: Uses `elections.config.js`.

## `elections.config.js`
- **state**: `"contesting"` | `"polling"` | `"result"`
  - **contesting**: Show only contenders (candidates); no results.
  - **polling**: Voting open; banner + bar shown; Elections page shows "vote now" message.
  - **result**: Show final results (default).
- **banner**: Shown when state is contesting or polling (election in progress).
- **pollingBar**: Bar shown when state is polling (e.g. "Polling for results").
- **contenders**: List of boards and roles/candidates for the contesting state.

## `clubs/`
- **categories.config.js**: Club categories and colors (filters on Clubs page).
- **spotlights.config.js**: Homepage club spotlights; rotates weekly. `clubName` must match the club **Name** in your clubs data (e.g. Google Sheet).

## `organizations.config.js`
- List of organizations (name, description, link). Use internal path (e.g. `MockTrial`) or full URL for external sites.

## Club custom website
- In your clubs data source (e.g. Google Sheet), add a **Website** or **CustomWebsite** column with the club’s URL. The club page will show a "Visit our website" link when set.
