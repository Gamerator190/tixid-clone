import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { ForgotPasswordComponent } from './forgot-password';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { vi } from 'vitest';

describe('ForgotPasswordComponent', () => {
  let component: ForgotPasswordComponent;
  let fixture: ComponentFixture<ForgotPasswordComponent>;
  let apiServiceMock: any;
  let routerMock: any;

  beforeEach(async () => {
    apiServiceMock = {
      forgotPassword: vi.fn().mockReturnValue(of({ success: true, message: 'Link sent' }))
    };

    routerMock = {
      navigate: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [ForgotPasswordComponent, FormsModule, CommonModule, RouterTestingModule],
      providers: [
        { provide: ApiService, useValue: apiServiceMock },
        { provide: Router, useValue: routerMock },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ForgotPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call apiService.forgotPassword on sendResetLink()', () => {
    component.email = 'test@example.com';
    component.sendResetLink();
    expect(apiServiceMock.forgotPassword).toHaveBeenCalledWith('test@example.com');
    expect(component.successMessage).toBe('Link sent');
  });

  it('should show error if email is empty', () => {
    component.email = '';
    component.sendResetLink();
    expect(apiServiceMock.forgotPassword).not.toHaveBeenCalled();
    expect(component.errorMessage).toBe('Please enter your email address.');
  });

  it('should navigate to login on goToLogin()', () => {
    component.goToLogin();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  });
});
