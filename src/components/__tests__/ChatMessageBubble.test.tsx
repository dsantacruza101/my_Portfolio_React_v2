import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ChatMessageBubble } from '../ChatMessageBubble';

describe('ChatMessageBubble', () => {
  it('right-aligns a user message', () => {
    render(<ChatMessageBubble message={{ id: '1', role: 'user', content: 'Hi there' }} />);

    expect(screen.getByText('Hi there')).toBeInTheDocument();
    expect(screen.getByText('Hi there').parentElement).toHaveClass('justify-end');
  });

  it('left-aligns an assistant message', () => {
    render(<ChatMessageBubble message={{ id: '2', role: 'assistant', content: 'Hello!' }} />);

    expect(screen.getByText('Hello!')).toBeInTheDocument();
    expect(screen.getByText('Hello!').parentElement).toHaveClass('justify-start');
  });
});
