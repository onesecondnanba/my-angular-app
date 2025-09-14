import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty fields', () => {
    expect(component.userForm.get('name')?.value).toBe('');
    expect(component.userForm.get('email')?.value).toBe('');
  });

  it('should mark form as invalid when empty', () => {
    expect(component.userForm.valid).toBeFalsy();
  });

  it('should mark form as valid with correct data', () => {
    const nameControl = component.userForm.get('name');
    const emailControl = component.userForm.get('email');

    nameControl?.setValue('John Doe');
    emailControl?.setValue('john@example.com');

    expect(component.userForm.valid).toBeTruthy();
  });

  it('should show validation messages when form is submitted with empty fields', () => {
    component.onSubmit();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const errorMessages = compiled.querySelectorAll('div[style="color: red"]');
    
    expect(errorMessages.length).toBe(2);
    expect(errorMessages[0].textContent).toContain('Name is required');
    expect(errorMessages[1].textContent).toContain('Valid email is required');
  });

  it('should reset form when reset button is clicked', () => {
    const nameControl = component.userForm.get('name');
    const emailControl = component.userForm.get('email');

    nameControl?.setValue('John Doe');
    emailControl?.setValue('john@example.com');
    component.submitted = true;

    component.resetForm();
    fixture.detectChanges();

    expect(nameControl?.value).toBe('');
    expect(emailControl?.value).toBe('');
    expect(component.submitted).toBeFalse();
  });

  it('should validate email format', () => {
    const emailControl = component.userForm.get('email');
    
    emailControl?.setValue('invalid-email');
    expect(emailControl?.errors?.['email']).toBeTruthy();

    emailControl?.setValue('valid@email.com');
    expect(emailControl?.errors).toBeNull();
  });
});