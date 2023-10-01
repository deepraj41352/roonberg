const emailTemplate = (options) => {
  const templateHead = `<html  lang="en">
  
  <head><link rel="stylesheet" type="text/css" hs-webfonts="true" href="https://fonts.googleapis.com/css?family=Lato|Lato:i,b,bi">
    <title>Email template</title>
    <meta property="og:title" content="Email template">
    
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

<meta http-equiv="X-UA-Compatible" content="IE=edge">

<meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <style type="text/css">
   
      a{ 
        text-decoration: underline;
        color: inherit;
        font-weight: bold;
        color: #253342;
      }
      
      h1 {
        font-size: 56px;
      }
      
        h2{
        font-size: 28px;
        font-weight: 900; 
      }
      
      p {
        font-weight: 100;
      }
      th{
        text-align:left;
      }
      td {
    vertical-align: top;
    text-aligh:left;
      }
      
      #email {
        margin: auto;
        width: 600px;
        background-color: white;
      }
      
      button{
        font: inherit;
        background-color: #FF7A59;
        border: none;
        padding: 10px;
        text-transform: uppercase;
        letter-spacing: 2px;
        font-weight: 900; 
        color: white;
        border-radius: 5px; 
        box-shadow: 3px 3px #d94c53;
      }
      
      .subtle-link {
        font-size: 9px; 
        text-transform:uppercase; 
        letter-spacing: 1px;
        color: #CBD6E2;
      }
      
    </style>
    
  </head>
    
    <body bgcolor="#F5F8FA" style="width: 100%; margin: auto 0; padding:0; font-family:Lato, sans-serif; font-size:18px; color:#33475B; word-break:break-word">
  
 <! View in Browser Link --> 
      
<div id="email">
     
  
  
  <! Banner --> 
         <table role="presentation" width="100%">
            <tr>
         
              <td bgcolor="#00A4BD" align="center" style="color: white;">
                            
                <h1> Welcome! </h1>
                
              </td>
        </table>`;

  const templateFooter = `<table role="presentation" bgcolor="#F5F8FA" width="100%" >
      <tr>
          <td align="left" style="padding: 30px 30px;">
            <p style="color:#99ACC2">© Copy right, 2023</p>
            </td>
          </tr>
      </table> 
      </div>
    </body>
      </html>`;

  switch (options.template) {
    case 'RESET-PASS':
      const templateBody = ` <!-- First Row --> 

      <table role="presentation" border="0" cellpadding="0" cellspacing="10px" style="padding: 30px 30px 30px 60px;">
         <tr>
       <td><p>Please Click the following link to reset your password:</p>
       <a href="${options.resetLink}">Reset Password</a></td>
         </tr>
                     </table>`;
      return templateHead + templateBody + templateFooter;
      break;

    case 'CREATE-PROJECT':
      const templateBody1 = ` <!-- First Row --> 
  <p> New Project created with the following details</p>
      <table role="presentation" border="0" cellpadding="0" cellspacing="10px" style="padding: 30px 30px 30px 60px;">
      <tr>
     <th>Contractor Name</th>
     <td>:</td>
     <td> ${options.user.first_name}</td>
      </tr>
      <tr>
     <th>Contractor Email</th>
     <td>:</td>
     <td> ${options.user.email}</td>
      </tr>
      <tr>
     <th>Project Name</th>
     <td>:</td>
     <td>${options.projectName}</td>
      </tr>
     <tr>
     <th>Project Description</th>
     <td>:</td>
     <td>${options.projectDescription}</td>
      </tr>
     
         </table>`;
      return templateHead + templateBody1 + templateFooter;
      break;
    default:
      break;
  }
};

export default emailTemplate;
