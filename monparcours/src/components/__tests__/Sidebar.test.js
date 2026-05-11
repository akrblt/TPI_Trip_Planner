import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import Sidebar from '../Sidebar.vue';
import EtapeItem from '../EtapeItem.vue';
import RouteStorage from '../RouteStorage.vue';

describe('Sidebar.vue - Orchestration Tests', () => {
  
  const mockEtapes = [
    { id: 1, name: 'Point 1', color: '#3388ff' },
    { id: 2, name: 'Point 2', color: '#ff4444' }
  ];

  const factory = (props = {}) => {
    return mount(Sidebar, {
      props: {
        etapes: [],
        ...props
      },
      global: {
        stubs: {
          EtapeItem: true, // Stubbing child components to focus on Sidebar logic
          RouteStorage: true
        }
      }
    });
  };

  // --- 1. Rendering & Conditional Logic (Success/Negative) ---
  describe('Conditional Rendering', () => {
    it('Success: should show the empty message when there are no points', () => {
      const wrapper = factory({ etapes: [] });
      expect(wrapper.find('.empty-msg').exists()).toBe(true);
      expect(wrapper.text()).toContain('No points added');
    });

    it('Negative: should NOT show the empty message when points exist', () => {
      const wrapper = factory({ etapes: mockEtapes });
      expect(wrapper.find('.empty-msg').exists()).toBe(false);
    });

    it('Success: should render the correct number of EtapeItem components', () => {
      const wrapper = factory({ etapes: mockEtapes });
      const items = wrapper.findAllComponents({ name: 'EtapeItem' });
      expect(items.length).toBe(2);
    });
  });

  // --- 2. Component Interaction & Event Forwarding (Success) ---
  describe('Event Forwarding', () => {
    it('Success: should forward "color-changed" event from EtapeItem to parent', async () => {
      const wrapper = factory({ etapes: mockEtapes });
      const firstItem = wrapper.findComponent({ name: 'EtapeItem' });
      
      const payload = { id: 1, color: '#000000' };
      // Simulate EtapeItem emitting an event
      await firstItem.vm.$emit('color-changed', payload);

      // Check if Sidebar forwarded the event
      expect(wrapper.emitted()).toHaveProperty('color-changed');
      expect(wrapper.emitted('color-changed')[0][0]).toEqual(payload);
    });

    it('Success: should forward "load-route" event from RouteStorage to parent', async () => {
      const wrapper = factory({ etapes: [] });
      const storageComp = wrapper.findComponent({ name: 'RouteStorage' });
      
      const savedData = [{ id: 99, name: 'Saved Rte' }];
      // Simulate RouteStorage emitting a loaded route
      await storageComp.vm.$emit('load-route', savedData);

      expect(wrapper.emitted()).toHaveProperty('load-route');
      expect(wrapper.emitted('load-route')[0][0]).toEqual(savedData);
    });
  });

  // --- 3. Props Passing (Success/Edge Case) ---
  describe('Data Flow', () => {
    it('Success: should pass the etapes prop correctly to RouteStorage', () => {
      const wrapper = factory({ etapes: mockEtapes });
      const storageComp = wrapper.findComponent({ name: 'RouteStorage' });
      
      expect(storageComp.props('etapes')).toEqual(mockEtapes);
    });

    it('Edge Case: should handle dynamic updates to the etapes prop', async () => {
      const wrapper = factory({ etapes: [] });
      
      // Update props after mounting
      await wrapper.setProps({ etapes: mockEtapes });
      
      const items = wrapper.findAllComponents({ name: 'EtapeItem' });
      expect(items.length).toBe(2);
      expect(wrapper.find('.empty-msg').exists()).toBe(false);
    });
  });
});