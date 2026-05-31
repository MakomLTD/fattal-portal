// =====================================================
//  MAKOM – פורטל פרויקטים פתאל | Google Apps Script
//  Code.gs  v3.0
// =====================================================

const SPREADSHEET_ID = 'PASTE_GOOGLE_SHEET_ID_HERE';
const SHEET_NAME     = 'projects';

// ─── נקודת כניסה ─────────────────────────────────────
function doGet(e) {
  const params = e && e.parameter ? e.parameter : {};

  // [1] JSON API — לרענון חי מצד הלקוח
  if (params.action === 'data') {
    try {
      return jsonResponse_({
        ok: true,
        projects: getProjects_(params),
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      return jsonResponse_({ ok: false, error: String(error.message || error), projects: [] });
    }
  }

  // [2] בדיקת תקינות פריסה
  if (params.test === '1') {
    return HtmlService
      .createHtmlOutput(
        '<div dir="rtl" style="font-family:Arial,sans-serif;padding:32px;color:#11193F">' +
        '<h1>✅ Apps Script עובד</h1>' +
        '<p>הפריסה תקינה. עכשיו פתחו את הכתובת ללא ?test=1 כדי לראות את הפורטל.</p></div>'
      )
      .setTitle('בדיקת Apps Script')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }

  // [3] תבנית HTML מלאה
  try {
    const template = HtmlService.createTemplateFromFile('index');
    template.projectsJson = JSON.stringify(getProjects_(params));
    template.scriptUrl    = ScriptApp.getService().getUrl();
    template.clientId     = params.client || '';
    template.tokenId      = params.token  || '';

    return template
      .evaluate()
      .setTitle('פורטל בקרת פרויקטים')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  } catch (error) {
    return HtmlService
      .createHtmlOutput(buildErrorHtml_(error))
      .setTitle('שגיאה בטעינת הפורטל')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }
}

// ─── שכבת נתונים ──────────────────────────────────────
function getProjects_(params) {
  if (!SPREADSHEET_ID || SPREADSHEET_ID === 'PASTE_GOOGLE_SHEET_ID_HERE') {
    return getSampleProjects_();
  }

  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
  if (!sheet) throw new Error('לא נמצא גיליון בשם "' + SHEET_NAME + '"');

  const values = sheet.getDataRange().getDisplayValues();
  if (values.length < 2) return [];

  const headers = values.shift().map(normalizeHeader_);
  const client  = String(params.client || '').trim().toLowerCase();
  const token   = String(params.token  || '').trim();

  return values
    .map(rowToObject_(headers))
    .filter(r => String(r.active || '').toUpperCase() !== 'FALSE')
    .filter(r => !client || String(r.client_id || '').trim().toLowerCase() === client)
    .filter(r => !token  || String(r.token     || '').trim()               === token)
    .map(r => ({
      project_name:     r.project_name,
      status:           r.status,
      description:      r.description,
      site_url:         r.site_url,
      youtube_url:      r.youtube_url,
      image_url:        r.image_url,
      location:         r.location,
      lat:              r.lat,
      lng:              r.lng,
      planned_end_date: r.planned_end_date,
      actual_end_date:  r.actual_end_date,
      tags:             r.tags,
      progress:         r.progress,
      risk:             r.risk,
      next_step:        r.next_step
    }));
}

function rowToObject_(headers) {
  return function(row) {
    return headers.reduce((obj, h, i) => { obj[h] = row[i] || ''; return obj; }, {});
  };
}

function normalizeHeader_(header) {
  const clean = String(header || '').trim();
  const map = {
    'לקוח':'client_id', 'מזהה לקוח':'client_id',
    'טוקן':'token',
    'פעיל':'active',
    'שם פרויקט':'project_name', 'פרויקט':'project_name',
    'סטטוס':'status',
    'תיאור':'description',
    'קישור אתר':'site_url', 'קישור':'site_url',
    'קישור יוטיוב':'youtube_url', 'סרטונים':'youtube_url', 'רשימת סרטונים':'youtube_url',
    'תמונה':'image_url', 'קישור תמונה':'image_url',
    'מיקום':'location',
    'קו רוחב':'lat',
    'קו אורך':'lng',
    'תאריך סיום מתוכנן':'planned_end_date', 'סיום מתוכנן':'planned_end_date', 'תאריך סיום':'planned_end_date',
    'תאריך סיום בפועל':'actual_end_date',   'סיום בפועל':'actual_end_date',
    'תגיות':'tags',
    'התקדמות':'progress', 'אחוז התקדמות':'progress',
    'סיכון':'risk',       'רמת סיכון':'risk',
    'פעולה הבאה':'next_step', 'צעד הבא':'next_step',
    'client_id':'client_id', 'token':'token', 'active':'active',
    'project_name':'project_name', 'status':'status', 'description':'description',
    'site_url':'site_url', 'youtube_url':'youtube_url', 'image_url':'image_url',
    'location':'location', 'lat':'lat', 'lng':'lng',
    'planned_end_date':'planned_end_date', 'actual_end_date':'actual_end_date',
    'tags':'tags', 'progress':'progress', 'risk':'risk', 'next_step':'next_step'
  };
  return map[clean] || clean;
}

// ─── נתוני ברירת מחדל ──
function getSampleProjects_() {
  return [
    {
      project_name:'לאונרדו קלאב ים המלח', status:'בביצוע',
      description:'אתר פרויקט המרכז את סטטוס העבודות, תיעוד מהשטח, לו"ז מעודכן ומסמכים רלוונטיים.',
      site_url:'https://sites.google.com/makomltd.com/fattal-dead-sea/', youtube_url:'',
      image_url:'https://fattal-cms-prod.s3.eu-central-1.amazonaws.com/2_e113a6719b.jpg',
      location:'ים המלח', lat:'31.2', lng:'35.3667',
      planned_end_date:'2026-12-31', actual_end_date:'',
      tags:'אתר פרויקט|מסמכים|עדכונים', progress:'45', risk:'בינוני', next_step:'תיאום עם קבלן ראשי'
    },
    {
      project_name:'לאונרדו פלאזה ירושלים', status:'בביצוע',
      description:'ריכוז דוחות ביצוע לפי קומות, סטטוס חדרים, צווארי בקבוק והמלצות להמשך ביצוע.',
      site_url:'https://sites.google.com/makomltd.com/leonardo-jerusalem-fattal/', youtube_url:'',
      image_url:'',
      location:'ירושלים', lat:'31.7683', lng:'35.2137',
      planned_end_date:'2026-10-31', actual_end_date:'',
      tags:'אתר פרויקט|מסמכים|עדכונים', progress:'62', risk:'גבוה', next_step:'בדיקת איכות שלב ג\''
    },
    {
      project_name:'מלון פלטין תל אביב', status:'בביצוע',
      description:'כניסה לאזור הפרויקט לצפייה בעדכונים, קבצים, תמונות וסיכומי ישיבות.',
      site_url:'https://sites.google.com/makomltd.com/fattal-palatin', youtube_url:'',
      image_url:'',
      location:'תל אביב', lat:'32.0853', lng:'34.7818',
      planned_end_date:'2027-02-28', actual_end_date:'',
      tags:'אתר פרויקט|מסמכים|עדכונים', progress:'28', risk:'נמוך', next_step:'התחלת שלב ב\''
    }
  ];
}

// ─── הגדרת ה-Sheet (הפעל פעם אחת מ-Apps Script Editor) ──
function setupSheet() {
  if (!SPREADSHEET_ID || SPREADSHEET_ID === 'PASTE_GOOGLE_SHEET_ID_HERE') {
    throw new Error('קודם עדכנו את SPREADSHEET_ID בקוד.');
  }
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  sheet.clear();

  const headers = [
    'client_id','token','active','project_name','status','description',
    'site_url','youtube_url','image_url','location','lat','lng',
    'planned_end_date','actual_end_date','tags','progress','risk','next_step'
  ];
  const rows = [
    ['fattal','abc123','TRUE','לאונרדו קלאב ים המלח','בביצוע',
     'אתר פרויקט המרכז סטטוס עבודות, מסמכים ותיעוד.',
     'https://sites.google.com/makomltd.com/fattal-dead-sea/','',
     'https://fattal-cms-prod.s3.eu-central-1.amazonaws.com/2_e113a6719b.jpg',
     'ים המלח','31.2','35.3667','2026-12-31','','אתר פרויקט|מסמכים|עדכונים','45','בינוני','תיאום עם קבלן'],
    ['fattal','abc123','TRUE','לאונרדו פלאזה ירושלים','בביצוע',
     'ריכוז דוחות ביצוע וסטטוס חדרים.',
     'https://sites.google.com/makomltd.com/leonardo-jerusalem-fattal/','','',
     'ירושלים','31.7683','35.2137','2026-10-31','','אתר פרויקט|מסמכים|עדכונים','62','גבוה','בדיקת איכות'],
    ['fattal','abc123','TRUE','מלון פלטין תל אביב','בביצוע',
     'עדכונים, קבצים, תמונות וסיכומי ישיבות.',
     'https://sites.google.com/makomltd.com/fattal-palatin','','',
     'תל אביב','32.0853','34.7818','2027-02-28','','אתר פרויקט|מסמכים|עדכונים','28','נמוך','התחלת שלב ב']
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, headers.length);
  Logger.log('✅ Sheet setup complete — ' + rows.length + ' rows written');
}

function debugProjects() {
  const rows = getProjects_({ client: 'fattal', token: 'abc123' });
  Logger.log(JSON.stringify(rows, null, 2));
  return rows;
}

function jsonResponse_(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

function buildErrorHtml_(error) {
  const msg = escapeHtml_(error && (error.stack || error.message) ? (error.stack || error.message) : String(error));
  return '<div dir="rtl" style="font-family:Arial,sans-serif;padding:32px;line-height:1.7;color:#11193F">' +
    '<h1>שגיאה בטעינת הפורטל</h1>' +
    '<p>בדקו ששם קובץ ה-HTML ב-Apps Script הוא <strong>index</strong> ושבוצעה פריסה כגרסה חדשה.</p>' +
    '<pre style="direction:ltr;text-align:left;white-space:pre-wrap;background:#FDEDEA;color:#7A2B21;border:1px solid #F4B4AA;border-radius:12px;padding:14px">' + msg + '</pre>' +
    '</div>';
}

function escapeHtml_(value) {
  return String(value)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
