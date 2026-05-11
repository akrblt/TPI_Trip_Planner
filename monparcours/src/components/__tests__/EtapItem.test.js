import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import EtapeItem from '../EtapeItem.vue';

describe('EtapeItem.vue - Comprehensive Tests', () => {
  // Mock data for a single step
  const getmockEtape =()=>( {
    id: 123,
    name: 'Test Point',
    color: '#3388ff',
    arrivalTime: '',
    comment: ''
  });

  const factory = (props = {}) => {
    return mount(EtapeItem, {
      props: {
        etape: getmockEtape(),
        index: 1,
        ...props
      }
    });
  };

  // --- 1. Rendering Tests (Success) ---
  describe('Rendering', () => {
    it('should display the correct index and name', () => {
      const wrapper = factory();
      expect(wrapper.text()).toContain('#1');
      expect(wrapper.text()).toContain('Test Point');
    });

    it('should apply the etape color to the card border', () => {
      const wrapper = factory();
      const card = wrapper.find('.etape-card');
      expect(card.attributes().style).toContain('border-left-color: rgb(51, 136, 255)');
    });

    it('should render all available color buttons', () => {
      const wrapper = factory();
      const buttons = wrapper.findAll('.color-btn');
      // Our component has 8 colors defined in availableColors
      expect(buttons.length).toBe(8);
    });
  });

  // --- 2. User Interactions (Success) ---
  describe('Interactions & Emits', () => {
    it('should emit "color-changed" when a color button is clicked', async () => {
      const wrapper = factory();
      const secondColorBtn = wrapper.findAll('.color-btn').at(1); // Usually red
      
      await secondColorBtn.trigger('click');

      // Check if event was emitted
      expect(wrapper.emitted()).toHaveProperty('color-changed');
      
      // Check if the emitted data is correct
      const emittedEvent = wrapper.emitted('color-changed')[0][0];
      expect(emittedEvent).toEqual({
        id: 123,
        color: '#ff4444'
      });
    });

    it('should update the active class when a color is selected', async () => {
      const wrapper = factory();
      const buttons = wrapper.findAll('.color-btn');
      
      // Initially, the first button is active because it matches mockEtape.color
      expect(buttons.at(0).classes()).toContain('active');

      // Click the second button
      await buttons.at(1).trigger('click');
      expect(buttons.at(1).classes()).toContain('active');
    });
  });

  // --- 3. Data Binding Tests (V-Model) ---
  describe('Data Binding', () => {
    it('should update etape.comment when textarea changes', async () => {
      const wrapper = factory();
      const textarea = wrapper.find('textarea');
      
      await textarea.setValue('New destination note');
      
      expect(wrapper.props().etape.comment).toBe('New destination note');
    });

    it('should update etape.arrivalTime when time input changes', async () => {
      const wrapper = factory();
      const timeInput = wrapper.find('input[type="time"]');
      
      await timeInput.setValue('14:30');
      
      expect(wrapper.props().etape.arrivalTime).toBe('14:30');
    });
  });

  // --- 4. Edge Cases & Negative Tests ---
  describe('Edge Cases', () => {
    it('Negative: should not crash if etape name is missing', () => {
      const incompleteEtape = { id: 1, color: '#000' };
      const wrapper = factory({ etape: incompleteEtape });
      
      expect(wrapper.exists()).toBe(true);
      expect(wrapper.find('strong').text()).toBe('#1');
    });

    it('Logic: should keep the "active" class on only one color button at a time', async () => {
      const wrapper = factory();
      const buttons = wrapper.findAll('.color-btn');
      
      await buttons.at(2).trigger('click'); // Click Green
      
      const activeButtons = wrapper.findAll('.color-btn.active');
      expect(activeButtons.length).toBe(1);
    });

    it('Constraint: arrival time input should have step attribute set to 60', () => {
      const wrapper = factory();
      const timeInput = wrapper.find('input[type="time"]');
      expect(timeInput.attributes('step')).toBe('60');
    });
  });
});