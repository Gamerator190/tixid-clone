import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { ResetPasswordComponent } from './reset-password';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { vi } from 'vitest';

describe('ResetPasswordComponent', () => {
  let component: ResetPasswordComponent;
  let fixture: ComponentFixture<ResetPasswordComponent>;
  let apiServiceMock: any;
  let routerMock: any;

  beforeEach(async () => {
    apiServiceMock = {
      resetPassword: vi.fn().mockReturnValue(of({ success: true, message: 'Password reset' }))
    };

    routerMock = {
      navigate: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [ResetPasswordComponent, FormsModule, CommonModule, RouterTestingModule],
      providers: [
        { provide: ApiService, useValue: apiServiceMock },
        { provide: Router, useValue: routerMock },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => 'test-token'
              }
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ResetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get token on init', () => {
    expect(component.token).toBe('test-token');
  });

  it('should call apiService.resetPassword on resetPassword()', () => {
    component.password = 'newpassword123';
    component.confirmPassword = 'newpassword123';
    component.resetPassword();
    expect(apiServiceMock.resetPassword).toHaveBeenCalledWith('test-token', 'newpassword123');
    expect(component.successMessage).toBe('Password reset');
  });
  
  it('should show error if passwords do not match', () => {
    component.password = 'newpassword123';
    component.confirmPassword = 'wrongpassword';
    component.resetPassword();
    expect(apiServiceMock.resetPassword).not.toHaveBeenCalled();
    expect(component.errorMessage).toBe('Passwords do not match.');
  });
});
