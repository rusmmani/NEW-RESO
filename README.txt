RESO Haircut - Vercel package

1. Upload this folder to GitHub and import the repository into Vercel.
2. In Google Apps Script, replace Code.gs with the included Code.gs.
3. Deploy Apps Script as Web App:
   Execute as: Me
   Who has access: Anyone
4. Copy the Apps Script /exec URL.
5. In Vercel: Project Settings > Environment Variables
   Name: GAS_URL
   Value: your Apps Script /exec URL
6. Redeploy Vercel.

URLs:
/       = customer booking
/admin  = admin dashboard

The frontend calls /api/reso. Vercel proxies requests to Google Apps Script, so the browser does not call Apps Script directly.
