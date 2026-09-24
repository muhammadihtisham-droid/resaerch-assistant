import { Router, Request, Response } from 'express';
import { AIProviderManager } from '../providers/AIProviderManager.ts';
import { searchAcademicWeb } from '../services/webSearchService.ts';
import { DEMO_PROJECT } from '../demoData.ts';

export const aiRouter = Router();
const aiManager = new AIProviderManager();

// GET /api/ai/status
aiRouter.get('/status', (req: Request, res: Response) => {
  try {
    const statuses = aiManager.getStatus();
    res.json({
      success: true,
      providers: statuses,
      serverTime: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/ai/test
aiRouter.post('/test', async (req: Request, res: Response) => {
  try {
    const { provider = 'grok', model } = req.body;
    if (provider !== 'grok' && provider !== 'groq') {
      res.status(400).json({ success: false, error: 'Invalid provider specified' });
      return;
    }

    const testResult = await aiManager.testProvider(provider, model);
    res.json({
      success: true,
      result: testResult
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Connection test failed'
    });
  }
});

// POST /api/ai/run
aiRouter.post('/run', async (req: Request, res: Response) => {
  try {
    const { provider = 'grok', task, payload, model, failoverEnabled = true, fallbackProvider } = req.body;

    if (!task) {
      res.status(400).json({ success: false, error: 'Missing research task' });
      return;
    }

    const result = await aiManager.runAI({
      provider,
      task,
      payload,
      model,
      failoverEnabled,
      fallbackProvider
    });

    res.json({
      success: true,
      ...result
    });
  } catch (error: any) {
    console.error('[aiRouter /run error]:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'AI execution failure'
    });
  }
});

// POST /api/ai/web-search
aiRouter.post('/web-search', async (req: Request, res: Response) => {
  try {
    const { query, projectId } = req.body;
    if (!query) {
      res.status(400).json({ success: false, error: 'Missing search query' });
      return;
    }

    const results = await searchAcademicWeb(query, projectId || 'default');
    res.json({
      success: true,
      results
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Web search failure'
    });
  }
});

// GET /api/ai/demo-project
aiRouter.get('/demo-project', (req: Request, res: Response) => {
  res.json({
    success: true,
    project: DEMO_PROJECT
  });
});
