import { signal, computed } from '@angular/core';
import { User, Role } from '../../shared/models';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export class AuthStore {
  private readonly _state = signal<AuthState>({
    user: null,
    isAuthenticated: false
  });

  readonly user = computed(() => this._state().user);
  readonly isAuthenticated = computed(() => this._state().isAuthenticated);
  readonly role = computed(() => this._state().user?.role);
  readonly isSuperAdmin = computed(() => this._state().user?.role === Role.SUPER_ADMIN);
  readonly isValidatedUser = computed(() => this._state().user?.role === Role.VALIDATED_USER);

  setUser(user: User | null): void {
    this._state.update(() => ({
      user,
      isAuthenticated: user !== null
    }));
  }

  clearUser(): void {
    this._state.set({
      user: null,
      isAuthenticated: false
    });
  }
}

export const authStore = new AuthStore();
