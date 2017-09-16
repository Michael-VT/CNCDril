unit CNCDril_r01;

interface

uses
  Windows, Messages, SysUtils, Variants, Classes, Graphics, Controls, Forms,
  Dialogs, Grids, StdCtrls, ExtCtrls, Menus, ComCtrls, TabNotBk, Math;

type
  TLPoint = record
    X, Y, L, C: Real;
    N, T: integer;
  end;
  TTools = record
    Npoint: integer;
    Sise: Real;
  end;

  TForm1 = class(TForm)
    OpenDialog1: TOpenDialog;
    TabbedNotebook1: TTabbedNotebook;
    StatusBar1: TStatusBar;
    MainMenu1: TMainMenu;
    Memo1: TMemo;
    Memo2: TMemo;
    Label2: TLabel;
    ComboBox2: TComboBox;
    Label3: TLabel;
    Label4: TLabel;
    SaveDialog1: TSaveDialog;
    Halp1: TMenuItem;
    Inchtomm1: TMenuItem;
    Image1: TImage;
    CheckBox1: TCheckBox;
    Edit17: TEdit;
    Label16: TLabel;
    Label17: TLabel;
    Edit18: TEdit;
    StringGrid3: TStringGrid;
    Image2: TImage;
    Timer1: TTimer;
    StringGrid4: TStringGrid;
    Button11: TButton;
    ComboBox4: TComboBox;
    Label18: TLabel;
    Edit19: TEdit;
    Button12: TButton;
    Label19: TLabel;
    Button13: TButton;
    ComboBox5: TComboBox;
    Edit1: TEdit;
    File1: TMenuItem;
    OpenDRLFile1: TMenuItem;
    ReloadDRLFile1: TMenuItem;
    SaveCNCFile1: TMenuItem;
    Exit1: TMenuItem;
    StringGrid1: TStringGrid;
    Button6: TButton;
    Button7: TButton;
    Button8: TButton;
    Config1: TMenuItem;
    Loadconfig1: TMenuItem;
    SaveConfig1: TMenuItem;
    Abaut1: TMenuItem;
    Timer2: TTimer;
    Button14: TButton;
    CheckBox2: TCheckBox;
    CheckBox3: TCheckBox;
    OpenDialog2: TOpenDialog;
    CheckBox4: TCheckBox;
    CheckBox5: TCheckBox;
    CheckBox6: TCheckBox;
    procedure FormCreate(Sender: TObject);
    procedure Exit1Click(Sender: TObject);
    procedure Button6Click(Sender: TObject);
    procedure OpenGCodefile1Click(Sender: TObject);
    procedure Button7Click(Sender: TObject);
    procedure Button8Click(Sender: TObject);
    procedure Inchtomm1Click(Sender: TObject);
    procedure Button11Click(Sender: TObject);
    procedure Timer1Timer(Sender: TObject);
    procedure Image2Click(Sender: TObject);
    procedure StringGrid4Click(Sender: TObject);
    procedure Button13Click(Sender: TObject);
    procedure Button12Click(Sender: TObject);
    procedure OpenDRLFile1Click(Sender: TObject);
    procedure ReloadDRLFile1Click(Sender: TObject);
    procedure SaveCNCFile1Click(Sender: TObject);
    procedure Loadconfig1Click(Sender: TObject);
    procedure SaveConfig1Click(Sender: TObject);
    procedure FormCanResize(Sender: TObject; var NewWidth,
      NewHeight: Integer; var Resize: Boolean);
    procedure Button14Click(Sender: TObject);
    procedure Image1Click(Sender: TObject);
  private
    { Private declarations }
  public
    { Public declarations }
  end;

var
  XYLp: array[0..10000,0..20] of record
    x,y,l:real;
    end;

  XYL: array[0..1000,0..20] of TLPoint;
  XY: array[0..20,0..10000] of TLPoint;

  sorted: array[0..10000,0..1] of real;
  fsorted: array[0..10000,0..1] of real;
  fsorted_cn: integer;
  sorted_len: integer;
  sorted_path: real;
  fanimate, start_en:integer;
  drill_L, drill_H, drill_hs, drill_ch, drill_hh, drill_hm: real;

  XYtools:array[0..20] of TTools;
  StatusStr:string;
  center:TLPoint;
  fkoef:real;
  startc,tooln,drilln:integer;
  img_counter:integer;
  cfg_file:string;

  Form1: TForm1;
  XYCOR: array[0..100,0..1000,0..1] of real;
  tool:integer;
  ukof,udkof,koftr:real;
  tools: array[0..100] of real;
  pozxy: array[0..100] of integer;
  st:array [0..255] of string;
  xCord,yCord: real;
  tf,xf,yf,uf,mf,rf,cf:byte;
  setunit:real;
  inunit:char;
  parsString: string;
  countstr:integer;
implementation

{$R *.dfm}
{$R images.RES}

function CNStr():string;
begin
  countstr:=countstr+1;
  if Form1.CheckBox5.Checked = false then Result := ''
  else
  if countstr < 10 then Result := 'N00'+IntToStr(countstr)+' '
  else
  if countstr < 100 then Result := 'N0'+IntToStr(countstr)+' '
  else
  Result := 'N'+IntToStr(countstr)+' ';
end;

function desep(stta:string):string;
var i:integer;
begin
  for i := 1 to length(stta)  do
  if (stta[i]= ',') or (stta[i]= '.')then stta[i]:=DecimalSeparator;
  Result:=stta;
end;

procedure TForm1.OpenDRLFile1Click(Sender: TObject);
begin
Button11Click(nil);
end;

procedure TForm1.ReloadDRLFile1Click(Sender: TObject);
begin
Button13Click(nil);
end;

procedure TForm1.SaveCNCFile1Click(Sender: TObject);
begin
 Button12Click(nil);
end;

procedure TForm1.Loadconfig1Click(Sender: TObject);
begin
Button7Click(nil);
end;

procedure TForm1.SaveConfig1Click(Sender: TObject);
begin
Button8Click(nil);
end;

procedure TForm1.FormCanResize(Sender: TObject; var NewWidth,
  NewHeight: Integer; var Resize: Boolean);
begin
    Memo1.Top:=16;
    Form1.Constraints.MinWidth:=800;
    Form1.Constraints.MinHeight:=600;
    TabbedNotebook1.Height:= Form1.Height-76;
    TabbedNotebook1.Width:= Form1.Width-12;
    Memo1.Height:=TabbedNotebook1.Height-76;
    Memo1.Width:=TabbedNotebook1.Width div 2;
    Memo2.Left:=TabbedNotebook1.Width div 2;
    Memo2.Height:=TabbedNotebook1.Height-76;
    Memo2.Width:=TabbedNotebook1.Width div 2-4;
    Label3.Left:=(TabbedNotebook1.Width div 4)-40;
    Label4.Left:=(TabbedNotebook1.Width div 4) * 3 -60;
    Label2.Left:=5;
    Label2.Top:=TabbedNotebook1.Height-55;
    ComboBox2.Left:=185;
    ComboBox2.Top:=TabbedNotebook1.Height-50;
    ComboBox2.Height:=20;
    CheckBox1.Left:=250;
    CheckBox1.Top:=TabbedNotebook1.Height-45;
    CheckBox2.Left:=320;
    CheckBox2.Top:=TabbedNotebook1.Height-45;
    CheckBox3.Left:=700;
    CheckBox3.Top:=TabbedNotebook1.Height-45;
    CheckBox4.Left:=700;
    CheckBox4.Top:=TabbedNotebook1.Height-65;
    CheckBox5.Left:=540;
    CheckBox5.Top:=TabbedNotebook1.Height-45;
    Button6.Width:=120;
    Button6.Height:=20;
    Button6.Left:=410;
    Button6.Top:=TabbedNotebook1.Height-50;
    StringGrid1.Left:=0;
    StringGrid1.Top:=0;
    StringGrid1.Width:=TabbedNotebook1.Width-2;
    StringGrid1.Height:=TabbedNotebook1.Height-2;
    Button11.Width:=80;
    Button11.Height:=20;
    Button11.Left:=1;
    Button11.Top:=TabbedNotebook1.Height-70;
    Button12.Width:=80;
    Button12.Height:=20;
    Button12.Left:=1;
    Button12.Top:=TabbedNotebook1.Height-50;
    Button13.Left:=95;
    Button13.Top:=TabbedNotebook1.Height-70;
    Label19.Left:=95;
    Label19.Top:=TabbedNotebook1.Height-45;
    Edit1.Left:=210;
    Edit1.Width:=185;
    Edit1.Top:=TabbedNotebook1.Height-70;
    Edit19.Left:=210;
    Edit19.Width:=140;
    Edit19.Top:=TabbedNotebook1.Height-50;
    ComboBox5.Left:=350;
    ComboBox5.Top:=TabbedNotebook1.Height-50;
    Label16.Left:=400;
    Label16.Top:=TabbedNotebook1.Height-65;
    Label17.Left:=400;
    Label17.Top:=TabbedNotebook1.Height-45;
    Edit17.Left:=515;
    Edit17.Width:=40;
    Edit17.Top:=TabbedNotebook1.Height-70;
    Edit18.Left:=515;
    Edit18.Width:=40;
    Edit18.Top:=TabbedNotebook1.Height-50;
    Label18.Left:=560;
    Label18.Top:=TabbedNotebook1.Height-70;
    Button14.Width:=60;
    Button14.Height:=20;
    Button14.Left:=620;
    Button14.Top:=TabbedNotebook1.Height-70;
    ComboBox4.Left:=560;
    ComboBox4.Top:=TabbedNotebook1.Height-50;
    Image1.Left:=0;
    Image1.Top:=0;
    Image1.Width:=TabbedNotebook1.Width;
    Image1.Height:=TabbedNotebook1.Height-75;
    Button7.Width:=80;
    Button7.Height:=20;
    Button7.Left:=680;
    Button7.Top:=TabbedNotebook1.Height-70;
    Button8.Width:=80;
    Button8.Height:=20;
    Button8.Left:=680;
    Button8.Top:=TabbedNotebook1.Height-50;

    StringGrid3.Top:=0;
    StringGrid3.Left:=0;
    StringGrid3.Width:=TabbedNotebook1.Width;
    StringGrid3.DefaultColWidth:=TabbedNotebook1.Width div 10;
    StringGrid3.Height:=TabbedNotebook1.Height-370;
    StringGrid4.Top:=TabbedNotebook1.Height-360;
    StringGrid4.Left:=Image2.Width+2;
    Image2.Left:=0;
    Image2.Top:=TabbedNotebook1.Height-360;

    StatusBar1.Height:=22;
    StatusBar1.Top:=Form1.Height-75;
end;

procedure TForm1.FormCreate(Sender: TObject);
var i: integer;
begin
fanimate:=0;
start_en:=0;
img_counter:=0;
Timer1.Enabled:=false;
StringGrid1.Cells[0,1]:='Start';
ComboBox2.ItemIndex:=0;
ComboBox5.ItemIndex:=0;
StringGrid3.Cells[0,0]:='Tool №';
StringGrid3.Cells[1,0]:='Diametr mm';
StringGrid3.Cells[2,0]:='Diametr Inch';
StringGrid3.Cells[3,0]:='Nomber';
StringGrid3.Cells[5,0]:='All Path';

     for i := 0 to 6 do    // Iterate
        begin
          StringGrid3.Cells[0,i+1]:='Tool №'+IntToStr(i+1);
        end;
StringGrid4.Cells[1,0]:='Значение';
StringGrid4.Cells[0,0]:='Параметр';
StringGrid4.Cells[0,1]:='H  -высота заготовки ';
StringGrid4.Cells[0,2]:='L  -общая глубина сверления';
StringGrid4.Cells[0,3]:='h  -высота вывода инструмента';
StringGrid4.Cells[0,4]:='h1,h2,..hn -глубина сверловки ';
StringGrid4.Cells[0,5]:='D  -диаметр инструмента ';
StringGrid4.Cells[0,6]:='F  -скорость обработки ';
StringGrid4.Cells[0,7]:='Dt -диаметр фрезы ';
StringGrid4.Cells[0,8]:='Точек в кластере для сортировки';
StringGrid4.Cells[0,9]:='m -Опустить быстро до ';
StringGrid4.Cells[0,10]:='Подъем до высоты смены инструмента ';
StringGrid4.Cells[0,11]:='Скоость прорисовки анимации мили сек';
StringGrid4.Cells[0,12]:=' ';
StringGrid4.Cells[0,13]:=' ';
StringGrid4.Cells[1,1]:=' ';
StringGrid4.Cells[1,1]:='9';
StringGrid4.Cells[1,2]:='9.2';
StringGrid4.Cells[1,3]:='3';
StringGrid4.Cells[1,4]:='1';
StringGrid4.Cells[1,5]:='3.2';
StringGrid4.Cells[1,6]:='100';
StringGrid4.Cells[1,7]:='3';
StringGrid4.Cells[1,8]:='5';
StringGrid4.Cells[1,9]:='1';
StringGrid4.Cells[1,10]:='30';
StringGrid4.Cells[1,11]:='30';
 ComboBox4.ItemIndex:=0;
 cfg_file:='GCode.cfg';
end;


procedure TForm1.Exit1Click(Sender: TObject);
begin
Close;
end;


procedure TForm1.Button6Click(Sender: TObject);
var  i,k,n,m, dz:integer;
  X,Y,toold:real;
  dzd, xArc, ctool: real;   //  startz,
begin
    m:=3;
    if fkoef=10000 then m:=4;
    if fkoef=100   then m:=2;
    if fkoef=10    then m:=1;
    countstr:=0;
 drill_L:=StrToFloat(desep(StringGrid4.Cells[1,2]));
 drill_H:=StrToFloat(desep(StringGrid4.Cells[1,1]));
 drill_hs:=StrToFloat(desep(StringGrid4.Cells[1,3]));
 drill_hh:=StrToFloat(desep(StringGrid4.Cells[1,4]));
 drill_hm:=StrToFloat(desep(StringGrid4.Cells[1,9]));
 drill_ch:=StrToFloat(desep(StringGrid4.Cells[1,10]));

    Memo2.Clear;
    Memo2.Lines.Add(CNStr()+'(Start drilling)');
    Memo2.Lines.Add(CNStr()+'M03 G90 G21 G17 F'+StringGrid4.Cells[1,6]);
    Memo2.Lines.Add(CNStr()+'G00 Z'+FloatToStrF(drill_ch,ffFixed,6,m));
     for k := 0 to 20-1 do    // Iterate
     if XYTools[k].Npoint<>0 then
     begin
        toold:=XYTools[k+1].Sise;
        Memo2.Lines.Add(CNStr()+'T0'+IntToStr(k+1));
        Memo2.Lines.Add(CNStr()+'(Chenge tool is started)');
        Memo2.Lines.Add(CNStr()+'G00 Z'+FloatToStrF(drill_ch,ffFixed,6,m));
        Memo2.Lines.Add(CNStr()+'G00 X'+Edit17.Text+' Y'+Edit18.Text);
        Memo2.Lines.Add(CNStr()+'M05');
        if m<4 then
          if toold >= StrToFloat(desep(StringGrid4.Cells[1,7])) then
              Memo2.Lines.Add(CNStr()+'(Set no standrd tool '+StringGrid4.Cells[1,7]+' mm, not fix for Hole'
              +FloatToStrF(toold,ffFixed,6,2)+' mm diametr)')
          else  Memo2.Lines.Add(CNStr()+'(Set tool '+FloatToStrF(toold,ffFixed,6,m)+' mm, not fix)')
        else
          if toold >= StrToFloat(StringGrid4.Cells[1,7]) then
              Memo2.Lines.Add(CNStr()+'(Set no standrd tool '+StringGrid4.Cells[1,7]+' mm, not fix for Hole '
              +FloatToStrF(toold*25.4,ffFixed,6,2)+'mm)')
          else  Memo2.Lines.Add(CNStr()+'(Set tool '+FloatToStrF(toold*25.4,ffFixed,6,m)+' mm, not fix)');
        Memo2.Lines.Add(CNStr()+'M06');
        Memo2.Lines.Add(CNStr()+'G00 Z00');
        Memo2.Lines.Add(CNStr()+'(Adjust and fix tool)');
        Memo2.Lines.Add(CNStr()+'M06');
        Memo2.Lines.Add(CNStr()+'G00 Z'+FloatToStrF(drill_ch,ffFixed,6,m));
        Memo2.Lines.Add(CNStr()+'M03');
        if toold > (StrToFloat(desep(StringGrid4.Cells[1,7]))+0.01) then
          begin
          // Процесс обработки, если вырезание диаметра тонкой фрезой -  инструмент тоньше отверстия
          ctool:=StrToFloat(desep(StringGrid4.Cells[1,7]));
          xArc:=(toold-ctool)/2;
         // startz:=drill_hs;
          dzd:=(drill_L)/drill_hh;
          dz:=trunc(dzd);
            for i := 0 to XYTools[k].Npoint-1 do    // Iterate
              begin
              for n := 1 to dz do
               begin
                Memo2.Lines.Add(CNStr()+'G00 Z'+FloatToStrF(drill_hs,ffFixed,6,m));
                Memo2.Lines.Add(CNStr()+'G00 X'+FloatToStrF(XY[k,i].X-xArc,ffFixed,6,m)+' Y'+FloatToStrF(XY[k,i].Y,ffFixed,6,m));
                Memo2.Lines.Add(CNStr()+'G00 Z'+FloatToStrF(drill_hm-((drill_hm+drill_L)/dz)*(n-1),ffFixed,6,m)+' F'+StringGrid4.Cells[1,6] );
                Memo2.Lines.Add(CNStr()+'G01 Z'+FloatToStrF(drill_hm-((drill_hm+drill_L)/dz)*n,ffFixed,6,m));
                Memo2.Lines.Add(CNStr()+'G01 X'+FloatToStrF(XY[k,i].X-xArc,ffFixed,6,m)+' Y'+FloatToStrF(XY[k,i].Y,ffFixed,6,m)+ ' G17');
                Memo2.Lines.Add(CNStr()+'G02 X'+FloatToStrF(XY[k,i].X+xArc,ffFixed,6,m)+' Y'+FloatToStrF(XY[k,i].Y,ffFixed,6,m)+' R'+FloatToStrF(xArc,ffFixed,6,m));
                Memo2.Lines.Add(CNStr()+'G02 X'+FloatToStrF(XY[k,i].X-xArc,ffFixed,6,m)+' Y'+FloatToStrF(XY[k,i].Y,ffFixed,6,m)+' R'+FloatToStrF(xArc,ffFixed,6,m));
               end;
              end;
          end
        else
          begin
          X := 10; Y :=10;
            for i := 0 to XYTools[k].Npoint-1 do    // Iterate
            begin
             if CheckBox6.Checked = true then
              begin
               if (XY[k,i].X < X) or (XY[k,i].Y < Y) then
                 Memo2.Lines.Add(CNStr()+'X'+FloatToStrF(XY[k,i].X-5,ffFixed,8,m)+' Y'+FloatToStrF(XY[k,i].Y-5,ffFixed,8,m));
                 X := XY[k,i].X; Y := XY[k,i].Y;
               Memo2.Lines.Add(CNStr()+'X'+FloatToStrF(XY[k,i].X,ffFixed,8,m)+' Y'+FloatToStrF(XY[k,i].Y,ffFixed,8,m));
               Memo2.Lines.Add(CNStr()+'G83 R'+StringGrid4.Cells[1,3]+' Z-'+StringGrid4.Cells[1,2]+' Q'+StringGrid4.Cells[1,4]);
               Memo2.Lines.Add(CNStr()+'G80');
              end
             else
              begin
               Memo2.Lines.Add(CNStr()+'X'+FloatToStrF(XY[k,i].X,ffFixed,8,m)+' Y'+FloatToStrF(XY[k,i].Y,ffFixed,8,m));
               if i=0 then Memo2.Lines.Add(CNStr()+'G83 R'+StringGrid4.Cells[1,3]+' Z-'+StringGrid4.Cells[1,2]+' Q'+StringGrid4.Cells[1,4]);
              end;
            end;
            Memo2.Lines.Add(CNStr()+'G80'); // Завершит режим сверловки с выбросом стружки
          end;
     end;
    Memo2.Lines.Add(CNStr()+'G00 Z'+StringGrid4.Cells[1,10]);
    Memo2.Lines.Add(CNStr()+'G00 X'+Edit17.Text+' Y'+Edit18.Text);
    Memo2.Lines.Add(CNStr()+'M05');
    Memo2.Lines.Add(CNStr()+'(Remove tool)');
    Memo2.Lines.Add(CNStr()+'M06');
    Memo2.Lines.Add(CNStr()+'(End drilling)');
end;

procedure TForm1.OpenGCodefile1Click(Sender: TObject);
begin
Button11Click(nil);
end;

procedure TForm1.Button7Click(Sender: TObject);
var  i:integer; s:string;  f: TextFile;
begin
   Memo1.Clear;
   AssignFile(f,cfg_file);
   {$I-}
   Reset(f);
   {$I+}
   if IOResult=0 then
    begin
     Readln(f,s);  Edit1.Text := s;
     Readln(f,s);  Edit17.Text := s;
     Readln(f,s);  Edit18.Text := s;
     Readln(f,s);  Edit19.Text := s;
     Readln(f,s);  ComboBox2.ItemIndex := StrToInt(s);
     Readln(f,s);  ComboBox4.ItemIndex := StrToInt(s);
     Readln(f,s);  ComboBox5.ItemIndex := StrToInt(s);
      for i := 1 to 15  do
       begin
        Readln(f,s);
        StringGrid4.Cells[1,i] := s;
       end;
      CloseFile(f);
    end
   else
  if OpenDialog2.Execute then
  begin
   OpenDialog2.FilterIndex:=1;
   AssignFile(f,OpenDialog2.FileName);
   cfg_file:=OpenDialog2.FileName;
   {$I-}
   Reset(f);
   {$I+}
   if IOResult=0 then
    begin
      Readln(f,s);  Edit1.Text := s;
      Readln(f,s);  Edit17.Text := s;
      Readln(f,s);  Edit18.Text := s;
      Readln(f,s);  Edit19.Text := s;
      Readln(f,s);  ComboBox2.ItemIndex := StrToInt(s);
      Readln(f,s);  ComboBox4.ItemIndex := StrToInt(s);
      Readln(f,s);  ComboBox5.ItemIndex := StrToInt(s);
      for i := 1 to 15  do
           begin Readln(f,s);  StringGrid4.Cells[1,i] := s;
           end;
     CloseFile(f);
    end;
  end;
end;

procedure TForm1.Button8Click(Sender: TObject);
var f: TextFile; i:integer;
begin
   AssignFile(f,cfg_file);
   {$I-}
   Rewrite(f);
   {$I+}
   if IOResult=0 then
   begin
    writeln(f,Edit1.Text);
    writeln(f,Edit17.Text);
    writeln(f,Edit18.Text);
    writeln(f,Edit19.Text);
    writeln(f,IntToStr(ComboBox2.ItemIndex));
    writeln(f,IntToStr(ComboBox4.ItemIndex));
    writeln(f,IntToStr(ComboBox5.ItemIndex));
     for i := 1 to 15  do  writeln(f,StringGrid4.Cells[1,i]);
     CloseFile(f);
   end;
end;


procedure TForm1.Inchtomm1Click(Sender: TObject);
begin
Application.MessageBox('In 1 inch - 25.399988 mm','Attension!',MB_YESNO+MB_ICONWARNING);
end;



function distance(xya:TLPoint; xyb:TLPoint): real;
begin
     Result:=sqrt((xyb.X-xya.X)*(xyb.X-xya.X)+(xyb.Y-xya.Y)*(xyb.Y-xya.Y));
end;

function extxy(stta:string):TLPoint;
var i,j,k:integer; xyr:TLPoint; num:string;
begin
  j:=0; k:=0;  xyr.X:=0;  xyr.Y:=0;  xyr.L:=0;  xyr.N:=0; xyr.C := 0; xyr.T := 0;
  for i := 1 to length(stta)  do
  begin
  if (stta[i]= 'X') then
      begin
          if ((k and 1)=1) and (num<>'') then  xyr.X:=StrToFloat(num);
          if ((k and 2)=2) and (num<>'') then  xyr.Y:=StrToFloat(num);
          if ((k and 4)=4) and (num<>'') then  xyr.T:=StrToInt(num);
          num:='';
          j:=j+1; k:=1;
      end;
  if (stta[i]= 'Y') then
      begin
          if ((k and 1)=1) and (num<>'') then  xyr.X:=StrToFloat(num);
          if ((k and 2)=2) and (num<>'') then  xyr.Y:=StrToFloat(num);
          if ((k and 4)=4) and (num<>'') then  xyr.T:=StrToInt(num);
          j:=j+2;   k:=2;
          num:='';
      end;
  if (stta[i]= 'T') then
      begin
          if ((k and 1)=1) and (num<>'') then  xyr.X:=StrToFloat(num);
          if ((k and 2)=2) and (num<>'') then  xyr.Y:=StrToFloat(num);
          if ((k and 4)=4) and (num<>'') then  xyr.T:=StrToInt(num);
          num:='';
          j:=j+4;  k:=4;
      end;
  if (stta[i]= DecimalSeparator) or (stta[i]= '-') or (stta[i]= '+')
   or ((stta[i]>= '0') and (stta[i]<= '9'))then  num:=num+stta[i];
  end;
          if ((k and 1)=1) and (num<>'') then  xyr.X:=StrToFloat(num);
          if ((k and 2)=2) and (num<>'') then  xyr.Y:=StrToFloat(num);
          if ((k and 4)=4) and (num<>'') then  xyr.T:=StrToInt(num);
  xyr.N:=j;
  xyr.X:=xyr.X/fkoef;
  xyr.Y:=xyr.Y/fkoef;
  Result:=xyr;
end;

function exttc(stta:string):TLPoint;
var i,j,k:integer; xyr:TLPoint; num:string;
begin
  j:=0; k:=0;  xyr.X:=0;  xyr.Y:=0;  xyr.L:=0;  xyr.N:=0; xyr.C := 0; xyr.T := 0;
  for i := 1 to length(stta)  do
  begin
  if (stta[i]= 'C') then
      begin
          if ((k and 1)=1) and (num<>'') then  xyr.C:=StrToFloat(num);
          if ((k and 2)=2) and (num<>'') then  xyr.T:=StrToInt(num);
          num:='';
          j:=j+1; k:=1;
      end;
  if (stta[i]= 'T') then
      begin
          if ((k and 1)=1) and (num<>'') then  xyr.C:=StrToFloat(num);
          if ((k and 2)=2) and (num<>'') then  xyr.T:=StrToInt(num);
          num:='';
          j:=j+2;  k:=2;
      end;
  if (stta[i]= DecimalSeparator) or (stta[i]= '-') or (stta[i]= '+')
   or ((stta[i]>= '0') and (stta[i]<= '9'))then  num:=num+stta[i];
  end;
          if ((k and 1)=1) and (num<>'') then  xyr.C:=StrToFloat(num);
          if ((k and 2)=2) and (num<>'') then  xyr.T:=StrToInt(num);
  xyr.N:=j;
  Result:=xyr;
end;

function parser(ps:string): integer;
var i,k,f:integer; chr:char; xyr:TLPoint;
begin
k:=0; f:=0; StatusStr := '';
  for i := 0 to 255 do st[i]:='';

  ps:=desep(ps);
  if ps[1]= ';' then  StatusStr:='(Comment '+ps+')'
  else
  if ps='M48'   then StatusStr:='Start Hider'
  else
  if ps='M30'   then  StatusStr:='End Drill'
  else
  if ps='%'     then
      begin StatusStr:='End Hider Start Drill'; startc:=1;
      end
  else
  if (startc = 1) and((ps[1]= 'X') or (ps[1]= 'Y') or (ps[1]= 'C') or (ps[1]= 'T'))
    then
      begin xyr:=extxy(ps);
        if xyr.N=1 then
            begin  XY[tooln,drilln].X := xyr.X; XY[tooln,drilln].Y := XY[tooln,drilln-1].Y;
            drilln := drilln+1;       XYtools[tooln].Npoint := drilln;
            end;
        if xyr.N=2 then
            begin  XY[tooln,drilln].Y := xyr.Y; XY[tooln,drilln].X := XY[tooln,drilln-1].X;
            drilln:=drilln+1;         XYtools[tooln].Npoint := drilln;
            end;
        if xyr.N=3 then
            begin  XY[tooln,drilln].X := xyr.X; XY[tooln,drilln].Y := xyr.Y;
            drilln := drilln+1;       XYtools[tooln].Npoint := drilln;
            end;
        if xyr.N=4 then
            begin
            tooln:=xyr.T-1; drilln:=0;
            end;
      end
  else
  if (startc = 0) and ((ps[1]= 'T') or (ps[1]= 'C'))
    then
      begin xyr:=exttc(ps);
        if xyr.N = 2 then
          begin
             if tooln <> trunc(xyr.T) then drilln:=0;
                tooln := trunc(xyr.T);  XYtools[tooln].Npoint := drilln;
          end;
        if xyr.N = 1 then
          begin XYtools[tooln].Sise := xyr.C;
          end;
        if xyr.N = 3 then
          begin
             if tooln <> trunc(xyr.T) then drilln:=0;
                tooln := trunc(xyr.T);
                XYtools[tooln].Npoint := drilln;
                XYtools[tooln].Sise := xyr.C;
          end;
      end
  else
  begin
      for i := 0 to 250 do st[i]:='';
      for i := 1 to length(ps) do
      begin
      chr:=ps[i];
        if (chr=' ')  or (chr='%') or (chr=':') or (chr='=') or (chr=',') or (chr='.') then
          if f=0 then
            begin  f:=1;  k:=k+1;
            end
          else f:=0
        else   f:=0;
        if f=0 then  st[k]:=st[k]+ chr;
      end;
  end;
  if st[0]='METRIC' then
          if st[1]='LZ' then fkoef:= power (10,length(st[3]))
          else
          if st[1]='TZ' then fkoef:= power (10,length(st[3]))
          else               fkoef:= power (10,length(st[2]));
  if st[0]='INCH'   then fkoef:= 10000;
      Result:=k;
end;

function jgraph:integer;
var kx, ky, minx, miny,maxx, maxy, ax, ay, bx, by: real;
    i, j, k, wx, wy, cpen,pa,colore:integer;
    sstat:string;
begin
  Form1.Image1.Picture.Bitmap:=TBitmap.Create;
  Form1.Image1.Picture.CleanupInstance;
  Form1.Image1.Visible:=true;
  Form1.Image1.Left:=0;
  Form1.Image1.Top:=0;
  Form1.Image1.Picture.Bitmap.Width := Form1.TabbedNotebook1.Width;
  Form1.Image1.Picture.Bitmap.Height := Form1.TabbedNotebook1.Height-75;
  Form1.Image1.Width:=Form1.TabbedNotebook1.Width;
  Form1.Image1.Height:=Form1.TabbedNotebook1.Height-75;

  wx:=Form1.Image1.Width;
  wy:=Form1.Image1.Height;
  with Form1.Image1.Canvas do
  begin
     Brush.Color:=clWhite;    Brush.Style:=bsSolid;
     Pen.Color:=clWhite;      Rectangle(0,0,wx,wy);
  end;    // with
  if fkoef=10000 then
     sstat:=' Unit INCH'
  else
     sstat:=' Unit METRIC';
    center.X:=StrToFloat(desep(Form1.Edit17.Text));
    center.Y:=StrToFloat(desep(Form1.Edit18.Text));
    ax:=center.X; ay:=center.Y;
    minx:=ax;     miny:=ay;
    maxx:=ax;     maxy:=ay;
      for k := 0 to 20-1 do    // Iterate
      if XYTools[k].Npoint<>0 then
      begin
      if Form1.CheckBox3.Checked=true then
          begin  ax:=XY[k,0].X;  ay:=XY[k,0].Y;
                 minx:=ax;       miny:=ay;
                 maxx:=ax;       maxy:=ay;
                 center.X:=ax;   center.Y:=ay;
          end;
      for i := 0 to XYTools[k].Npoint-1 do    // Iterate
       begin
        if XY[k,i].X<>0 then ax:=XY[k,i].X;
        if XY[k,i].Y<>0 then ay:=XY[k,i].Y;
         if minx=0 then minx:=ax;
         if miny=0 then miny:=ay;
         if minx > ax then minx:=ax;
         if maxx < ax then maxx:=ax;
         if miny > ay then miny:=ay;
         if maxy < ay then maxy:=ay;
       end;
      end;
     if Form1.CheckBox3.Checked=true then center.X:=(minx+maxx)/2;
     if Form1.CheckBox3.Checked=true then center.Y:=(miny+maxy)/2;
     if Form1.CheckBox3.Checked=true then Form1.Edit17.Text:=FloatToStrF(center.X,ffFixed,6,2);
     if Form1.CheckBox3.Checked=true then Form1.Edit18.Text:=FloatToStrF(center.Y,ffFixed,6,2);
     minx:=minx*0.90;     miny:=miny*0.90;     maxx:=maxx*1.01;     maxy:=maxy*1.01;
     kx:=wx/(maxx-minx);     ky:=wy/(maxy-miny);
     if     Form1.CheckBox4.Checked = true then
     if kx > ky  then kx:=ky
                 else ky:=kx;

     Form1.StatusBar1.Panels[0].Text:=
     'MinX='+FloatToStrF(minx,ffFixed,6,3)+     ' MinY='+FloatToStrF(miny,ffFixed,6,3)+
     ' MaxX='+FloatToStrF(maxx,ffFixed,6,3)+     ' MaxY='+FloatToStrF(maxy,ffFixed,6,3)+
     ' Tool1='+IntToStr(XYTools[0].Npoint)+      ' Tool2='+IntToStr(XYTools[1].Npoint)+
     ' Tool3='+IntToStr(XYTools[2].Npoint)+      ' Tool4='+IntToStr(XYTools[3].Npoint)+
     ' Tool5='+IntToStr(XYTools[4].Npoint)+      ' Tool6='+IntToStr(XYTools[5].Npoint)+
     ' Tool7='+IntToStr(XYTools[6].Npoint)+      ' Tool8='+IntToStr(XYTools[7].Npoint)+
     sstat;
  bx:=center.X;
  by:=center.Y;
  for i := 0 to 20-1 do
  if XYTools[i].Npoint<>0 then
  for j := 0 to XYTools[i].Npoint do
            with Form1.Image1.Canvas do
            begin
                if j=0 then
                  begin bx:=center.X; by:=center.Y;
                  end;
                    ax:=bx; ay:=by;
                if j=XYTools[i].Npoint then
                  begin bx:=center.X;  by:=center.Y;
                  end
                else
                  begin bx:=XY[i,j].X;  by:=XY[i,j].Y;
                  end;
              if ((bx-ax)<>0) or ((by-ay)<>0) then
              begin
              if fanimate = 1
                then
                begin
                sleep(StrToInt(Form1.StringGrid4.Cells[1,11]));
                Form1.Image1.Refresh;
                end;
              pa:=trunc(XYTools[i].Sise)*2;     if pa<3 then pa:=3;
              Brush.Color:=clBlue;  Brush.Style:=bsSolid;
              Pen.Color:=clBlue;    Pen.Style:=psSolid;   Pen.Width:=4;
              cpen:= (i and $7);
              if cpen = 0 then Pen.Color := clBlue;
              if cpen = 1 then Pen.Color := clRed;
              if cpen = 2 then Pen.Color := clAqua;
              if cpen = 3 then Pen.Color := clGreen;
              if cpen = 4 then Pen.Color := clPurple;
              if cpen = 5 then Pen.Color := clLime;
              if cpen = 6 then Pen.Color := clFuchsia;
              if cpen = 7 then Pen.Color := clYellow;
              Pen.Width:=1;
              Ellipse(trunc((ax-minx)*kx)-pa,wy-trunc((ay-miny)*ky)-pa,trunc((ax-minx)*kx)+pa,wy-trunc((ay-miny)*ky)+pa);
              MoveTo(trunc((ax-minx)*kx),wy-trunc((ay-miny)*ky));     LineTo(trunc((bx-minx)*kx),wy-trunc((by-miny)*ky));
              end;
            end;
            Result:=0;
    fanimate:=0;
end;


function sort_distance(a, b: array of real):real;
begin
result:=sqrt(sqr(a[0]-b[0])+sqr(a[1]-b[1]));
end;

procedure sort_from_center(center: array of real);
var
i, j: integer;
tmp: real;
begin
     for i := 0 to sorted_len do
      for j := 0 to i - 1 do
      begin
        if (sort_distance(center, sorted[i]) > sort_distance(center, sorted[j])) then
        begin
           tmp := sorted[j][0];          // X
           sorted[j][0] := sorted[i][0];
           sorted[i][0] := tmp;
           tmp := sorted[j][1];          // Y
           sorted[j][1] := sorted[i][1];
           sorted[i][1] := tmp;
        end;
      end;
end;

function optics_recurse(minpts:integer; center: array of real):integer;
var
   i: integer;
   point: array[0..1] of real;
begin
 sort_from_center(center);
 for i := 0 to minpts do
 begin
  if (sorted_len > -1 ) then
  begin
   point[0] := sorted[sorted_len][0];
   point[1] := sorted[sorted_len][1];
   sorted_len := sorted_len - 1;
   sorted_path := sorted_path + sort_distance(center, point);
   fsorted[fsorted_cn][0]:=point[0];
   fsorted[fsorted_cn][1]:=point[1];
   fsorted_cn:=fsorted_cn+1;
  end;
 end;
 if (sorted_len > -1) then optics_recurse(minpts, point);
 Result:=0;
end;

function ParsSG():integer;
var   i,k:integer;
begin
 for k := 0 to 39 do
 for i := 0 to 2000 do Form1.StringGrid1.Cells[k,i+1]:='';
 for k := 0 to 19 do
    begin
       Form1.StringGrid3.Cells[0,k+1]:='';
       Form1.StringGrid3.Cells[1,k+1]:='';
    end;

 for k := 0 to 19 do
   if XYTools[k].Npoint <> 0 then
     begin
        Form1.StringGrid3.Cells[0,k+1]:='Toll № '+IntToStr(k+1);
        Form1.StringGrid3.Cells[1,k+1]:=FloatToStrF(XYTools[k+1].Sise,ffFixed,6,3);
        Form1.StringGrid3.Cells[2,k+1]:=FloatToStrF(XYTools[k+1].Sise/25.4,ffFixed,6,3);
        Form1.StringGrid3.Cells[3,k+1]:=IntToStr(XYTools[k].Npoint);
      for i := 0 to XYTools[k].Npoint-2 do    // Iterate
      begin
        Form1.StringGrid1.Cells[k*2,i+1]:=FloatToStrF(XY[k,i].X,ffFixed,6,3);
        Form1.StringGrid1.Cells[k*2+1,i+1]:=FloatToStrF(XY[k,i].Y,ffFixed,6,3);
      end;    // for
     end;
 Result:=0;
end;

function SortByPath():integer;
const  min_pts = 1;
var j, k: integer;  start_from: array[0..1] of real;
begin
 for k := 0 to 20-1 do
  if XYTools[k].Npoint<>0 then
   begin
    sorted_len := XYTools[k].Npoint-1;
    sorted_path := 0;
    fsorted_cn:=0;
    start_from[0]:=center.X; // X
    start_from[1]:=center.Y; // Y
    for j := 0 to XYTools[k].Npoint-1 do
    begin
     sorted[j][0]:=XY[k,j].X;
     sorted[j][1]:=XY[k,j].Y;
    end;
    optics_recurse(min_pts, start_from);
    Form1.StringGrid3.Cells[5,k+1]:=FloatToStrF(sorted_path,ffFixed,6,3);
    for j := 0 to XYTools[k].Npoint-1 do
    begin
     XY[k,j].X:=fsorted[j][0];
     XY[k,j].Y:=fsorted[j][1];
    end;
   end;
 Result:=0;
end;

function SortByX():integer;
var ax,ay,bx,by:real;  i,k,j,m,n:integer;
begin
 for k := 0 to 19 do
   if XYTools[k].Npoint <> 0 then
     begin
      for n := 0 to XYTools[k].Npoint-2 do    // Iterate
      begin
      for i := 0 to XYTools[k].Npoint-2 do    // Iterate
       begin
       m:=k; j:=i;
         ax:=XY[m,j].X;
         ay:=XY[m,j].Y;
         bx:=XY[m,j+1].X;
         by:=XY[m,j+1].Y;
         if ax > bx  then
          begin
          XY[m,j].X:=bx;
          XY[m,j].Y:=by;
          XY[m,j+1].X:=ax;
          XY[m,j+1].Y:=ay;
          end
         else
         if (ax = bx) and (ay > by) then
          begin
          XY[m,j].X:=bx;
          XY[m,j].Y:=by;
          XY[m,j+1].X:=ax;
          XY[m,j+1].Y:=ay;
          end;
       end;
      end;    // for
     end;
 Result:=0;
end;

function SortByY():integer;
var ax,ay,bx,by:real;  i,k,j,m,n:integer;
begin
  for k := 0 to 19 do
  if XYTools[k].Npoint<>0 then
    begin
      for n := 0 to XYTools[k].Npoint-2 do    // Iterate
      begin
      for i := 0 to XYTools[k].Npoint-2 do    // Iterate
       begin
       m:=k; j:=i;
         ax:=XY[m,j].X;
         ay:=XY[m,j].Y;
         bx:=XY[m,j+1].X;
         by:=XY[m,j+1].Y;
         if (ay > by)  then
          begin
          XY[m,j].X:=bx;
          XY[m,j].Y:=by;
          XY[m,j+1].X:=ax;
          XY[m,j+1].Y:=ay;
          end
         else
         if (ay = by) and (ax > bx) then
          begin
          XY[m,j].X:=bx;
          XY[m,j].Y:=by;
          XY[m,j+1].X:=ax;
          XY[m,j+1].Y:=ay;
          end;
       end;
      end;    // for
    end;
 Result:=0;
end;

procedure TForm1.Button11Click(Sender: TObject);
var s:string; i,j: integer; f: TextFile;
 begin
  fkoef:=1; tooln:=0; drilln:=0; startc:=0;
  for i := 0 to 20 do  for j := 0 to 1000 do
  begin   XY[i,j].X:=0;    XY[i,j].Y:=0;  XY[i,j].L:=0;
          XY[i,j].N:=0;    XY[i,j].C:=0;  XY[i,j].T:=0;
  end;
  for i := 0 to 20 do
    begin XYtools[i].Npoint:=0; XYtools[i].Sise:=0;
    end;
    Memo1.Clear;  Memo2.Clear;
 if OpenDialog1.Execute then
  begin
   OpenDialog1.FilterIndex:=1;
   AssignFile(f,OpenDialog1.FileName);
   Edit1.Text:=OpenDialog1.FileName;
   {$I-}
   Reset(f);
   {$I+}
   if IOResult=0 then
    begin
    Memo1.Clear; Memo2.Clear;
     while not Eof(f) do
         begin  readln(f,s);
                if CheckBox1.Checked = true then Memo1.Lines.Add(s);
                parser(s);
         end;
     CloseFile(f);
    Button6.Enabled:=true;
    Button12.Enabled:=true;
    Button13.Enabled:=true;
    Button14.Enabled:=true;
    CheckBox4.Enabled:=true;
    end
    else
    begin
    Button12.Enabled:=false;
    Button13.Enabled:=false;
    Button14.Enabled:=false;
    CheckBox4.Enabled:=false;
    end;
  end;
  if ComboBox4.ItemIndex=1 then SortByX();
  if ComboBox4.ItemIndex=2 then SortByY();
  if ComboBox4.ItemIndex=3 then SortByPath();
  jgraph();
  if CheckBox2.Checked=true then Button6Click(nil);
  ParsSG();
  start_en:=0;
end;



procedure TForm1.Timer1Timer(Sender: TObject);
begin
if img_counter=0 then  Image2.Picture.Bitmap.Create.LoadFromResourceName(hInstance, 'Drill00');
if img_counter=1 then  Image2.Picture.Bitmap.Create.LoadFromResourceName(hInstance, 'Drill06');
if img_counter=2 then  Image2.Picture.Bitmap.Create.LoadFromResourceName(hInstance, 'Drill00');
if img_counter=3 then  Image2.Picture.Bitmap.Create.LoadFromResourceName(hInstance, 'Drill01');
if img_counter=4 then  Image2.Picture.Bitmap.Create.LoadFromResourceName(hInstance, 'Drill00');
if img_counter=5 then  Image2.Picture.Bitmap.Create.LoadFromResourceName(hInstance, 'Drill02');
if img_counter=6 then  Image2.Picture.Bitmap.Create.LoadFromResourceName(hInstance, 'Drill00');
if img_counter=7 then  Image2.Picture.Bitmap.Create.LoadFromResourceName(hInstance, 'Drill03');
if img_counter=8 then  Image2.Picture.Bitmap.Create.LoadFromResourceName(hInstance, 'Drill00');
img_counter:=img_counter+1; if img_counter=9 then img_counter:=0;
end;

procedure TForm1.Image2Click(Sender: TObject);
begin
 if Timer1.Enabled = true then
     Timer1.Enabled:=false
else Timer1.Enabled:=true;
end;

procedure TForm1.StringGrid4Click(Sender: TObject);
var
  y:integer;
begin
  Timer1.Enabled:=false;
  y:=StringGrid4.Row;
    if y=1 then Image2.Picture.Bitmap.Create.LoadFromResourceName(hInstance, 'Drill08');
    if y=2 then Image2.Picture.Bitmap.Create.LoadFromResourceName(hInstance, 'Drill04');
    if y=3 then Image2.Picture.Bitmap.Create.LoadFromResourceName(hInstance, 'Drill00');
    if y=4 then Image2.Picture.Bitmap.Create.LoadFromResourceName(hInstance, 'Drill01');
    if y=5 then Image2.Picture.Bitmap.Create.LoadFromResourceName(hInstance, 'Drill02');
    if y=6 then Image2.Picture.Bitmap.Create.LoadFromResourceName(hInstance, 'Drill05');
    if y=7 then Image2.Picture.Bitmap.Create.LoadFromResourceName(hInstance, 'Drill10');
    if y=8 then Image2.Picture.Bitmap.Create.LoadFromResourceName(hInstance, 'Drill09');
    if y=9 then Image2.Picture.Bitmap.Create.LoadFromResourceName(hInstance, 'Drill07');
    if y=10 then Image2.Picture.Bitmap.Create.LoadFromResourceName(hInstance, 'Drill00');
end;

procedure TForm1.Button13Click(Sender: TObject);
var s:string; i,j: integer;  f: TextFile;
 begin
  fkoef:=1; tooln:=0; drilln:=0; startc:=0;
  for i := 0 to 20 do  for j := 0 to 1000 do
  begin   XY[i,j].X:=0;    XY[i,j].Y:=0;     XY[i,j].L:=0;
          XY[i,j].N:=0;    XY[i,j].C:=0;     XY[i,j].T:=0;
  end;
  for i := 0 to 20 do
    begin
     XYtools[i].Npoint:=0;
     XYtools[i].Sise:=0;
    end;
    Memo1.Clear;  Memo2.Clear;
  begin
   OpenDialog1.FilterIndex:=1;
   AssignFile(f,OpenDialog1.FileName);
   Edit1.Text:=OpenDialog1.FileName;
   {$I-}
   Reset(f);
   {$I+}
   if IOResult=0 then
    begin
    Memo1.Clear; Memo2.Clear;
     while not Eof(f) do
         begin
          readln(f,s);
          if CheckBox1.Checked = true then Memo1.Lines.Add(s);
          parser(s);
         end;
     CloseFile(f);
    end;
  end;
  if ComboBox4.ItemIndex=1 then SortByX();
  if ComboBox4.ItemIndex=2 then SortByY();
  if ComboBox4.ItemIndex=3 then SortByPath();
    jgraph();
  if CheckBox2.Checked=true then Button6Click(nil);
  ParsSG();
  start_en:=0;
end;

procedure TForm1.Button12Click(Sender: TObject);
var
 i,fini: integer;
 f: TextFile;
begin
SaveDialog1.FileName:=Edit19.Text+'.'+ComboBox5.Text;
if SaveDialog1.Execute then
 begin
  if FileExists(SaveDialog1.FileName)=true then
  if Application.MessageBox('Данный файл уже существует !'+#13+'    Вы хотите заменить его?','Внимание!',MB_YESNO+MB_ICONWARNING)=mrNo then exit;
  AssignFile(f,SaveDialog1.FileName);
  {$I-}
  Rewrite(f);
  {$I+}
  if IOResult=0 then
   begin
   fini:=Memo2.Lines.Count- 1;
    for i := 0 to fini do    // Iterate
    begin
    writeln(f,Memo2.Lines[i]);
    end;    // for
    CloseFile(f);
   end
  else
   begin
    Application.MessageBox(''+#13+'  Не указано имя файла'+#13+'для сохранения данных !!!','Внимание!',MB_OK+MB_ICONWARNING);
   end;
 end;
end;


procedure TForm1.Button14Click(Sender: TObject);
begin
  fanimate:=1;
  Button13Click(nil);
  fanimate:=0;
  Exit;
end;

procedure TForm1.Image1Click(Sender: TObject);
begin
  fanimate:=0;
end;

end.
