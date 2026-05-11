import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import RouteStorage from '../RouteStorage.vue';

describe('RouteStorage.vue - Final Logic Tests', () => {
  
  const mockEtapes = [
    { id: 1, name: 'Yverdon', color: '#3388ff' }
  ];

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    // Mock window.alert
    vi.spyOn(window, 'alert').mockImplementation(() => {});
  });

  // --- 1. saveRoute() Tests ---
  describe('saveRoute()', () => {
    it('Success: should save to localStorage and alert when data exists', async () => {
      const wrapper = mount(RouteStorage, {
        props: { etapes: mockEtapes }
      });
      
      await wrapper.find('button:nth-child(1)').trigger('click');

      expect(localStorage.getItem('myRoute')).toContain('Yverdon');
      expect(window.alert).toHaveBeenCalledWith("Saved!");
    });

    it('Negative: should NOT save and show warning alert if etapes is empty', async () => {
      const wrapper = mount(RouteStorage, {
        props: { etapes: [] }
      });
      
      await wrapper.find('button:nth-child(1)').trigger('click');

      expect(localStorage.getItem('myRoute')).toBeNull();
      expect(window.alert).toHaveBeenCalledWith("Nothing to save! Please add some points first");
    });
  });

  // --- 2. loadRoute() Tests ---
  describe('loadRoute()', () => {
    it('Success: should parse and emit data when valid JSON exists', async () => {
      localStorage.setItem('myRoute', JSON.stringify(mockEtapes));
      const wrapper = mount(RouteStorage);
      
      await wrapper.find('button:nth-child(2)').trigger('click');

      expect(wrapper.emitted('load-route')[0][0]).toEqual(mockEtapes);
    });

    it('Negative: should alert "No route found" if localStorage is null', async () => {
      const wrapper = mount(RouteStorage);
      
      await wrapper.find('button:nth-child(2)').trigger('click');

      expect(window.alert).toHaveBeenCalledWith("No route found in storage!");
      expect(wrapper.emitted('load-route')).toBeUndefined();
    });

    it('Negative: should alert "No route found" if data is an empty array string "[]"', async () => {
      localStorage.setItem('myRoute', '[]');
      const wrapper = mount(RouteStorage);
      
      await wrapper.find('button:nth-child(2)').trigger('click');

      expect(window.alert).toHaveBeenCalledWith("No route found in storage!");
    });

    it('Error Handling: should alert "Error parsing stored data" if JSON is invalid', async () => {
      localStorage.setItem('myRoute', 'invalid-json-content');
      const wrapper = mount(RouteStorage);
      
      await wrapper.find('button:nth-child(2)').trigger('click');

      expect(window.alert).toHaveBeenCalledWith("Error parsing stored data.");
      expect(wrapper.emitted('load-route')).toBeUndefined();
    });
  });
});