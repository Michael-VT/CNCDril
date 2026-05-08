program CNCDril;

uses
  Forms,
  CNCDril_r01 in 'CNCDril_r01.pas' {Form1};

{$R *.res}

begin
  Application.Initialize;
  Application.Title := 'DRL file convert to CNC or mill';
  Application.CreateForm(TForm1, Form1);
  Application.Run;
end.
