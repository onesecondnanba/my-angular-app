import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, AppComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should render title in h1', () => {
    const h1 = fixture.nativeElement.querySelector('h1');
    expect(h1.textContent).toContain('Angular Test Demo');
  });

  it('should invalidate form if required fields are empty', () => {
    component.userForm.patchValue({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      deposit: null
    });
    expect(component.userForm.valid).toBeFalse();
  });

  it('should validate email format', () => {
    component.userForm.patchValue({ email: 'invalid-email' });
    expect(component.userForm.get('email')?.valid).toBeFalse();
    component.userForm.patchValue({ email: 'test@example.com' });
    expect(component.userForm.get('email')?.valid).toBeTrue();
  });

  it('should show error if passwords do not match', () => {
    component.userForm.patchValue({ password: 'abc', confirmPassword: 'def' });
    fixture.detectChanges();
    expect(component.userForm.hasError('passwordMismatch')).toBeTrue();
  });

  it('should validate deposit is not negative', () => {
    component.userForm.patchValue({ deposit: -10 });
    expect(component.userForm.get('deposit')?.valid).toBeFalse();
    component.userForm.patchValue({ deposit: 10 });
    expect(component.userForm.get('deposit')?.valid).toBeTrue();
  });

  it('should require customerId if isOldCustomer is checked', () => {
    component.userForm.patchValue({ isOldCustomer: true, customerId: '' });
    component.userForm.get('customerId')?.updateValueAndValidity();
    expect(component.userForm.get('customerId')?.valid).toBeFalse();
    component.userForm.patchValue({ customerId: 'C123' });
    expect(component.userForm.get('customerId')?.valid).toBeTrue();
  });

  it('should call onSubmit and set submitted to true', () => {
    spyOn(console, 'log');
    component.userForm.patchValue({
      name: 'Test',
      email: 'test@example.com',
      password: 'pass',
      confirmPassword: 'pass',
      deposit: 10,
      isOldCustomer: false
    });
    component.onSubmit();
    expect(component.submitted).toBeTrue();
    expect(console.log).toHaveBeenCalledWith('Form Submitted', jasmine.objectContaining({
      name: 'Test',
      email: 'test@example.com'
    }));
  });

  it('should reset form and submitted flag', () => {
    component.submitted = true;
    component.userForm.patchValue({ name: 'Test' });
    component.resetForm();
    expect(component.userForm.value.name).toBeNull();
    expect(component.submitted).toBeFalse();
  });

  it('should show deposit warning in template if deposit > 50', () => {
    component.userForm.patchValue({ deposit: 100 });
    fixture.detectChanges();
    const warning = fixture.nativeElement.querySelector('.warning');
    expect(warning).toBeTruthy();
    expect(warning.textContent).toContain('Deposit is high');
  });

  it('should show customerId input if isOldCustomer is checked', () => {
    component.userForm.patchValue({ isOldCustomer: true });
    fixture.detectChanges();
    const customerIdInput = fixture.nativeElement.querySelector('input[formControlName="customerId"]');
    expect(customerIdInput).toBeTruthy();
  });
});